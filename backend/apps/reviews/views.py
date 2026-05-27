from rest_framework.views import APIView
from rest_framework.response import Response

from apps.emissions.models import EmissionRecord
from apps.emissions.serializers import EmissionRecordSerializer
from apps.ingestion.models import RawRecord
from apps.ingestion.serializers import RawRecordSerializer
from django.utils import timezone

from .models import AuditLog


class ReviewRecordsView(APIView):

    def get(self,request):
        records=EmissionRecord.objects.all()

        suspicious=request.GET.get("suspicious")
        status_filter=request.GET.get("status")

        if suspicious=="true":
            records=records.filter(suspicious=True)

        if status_filter:
            records=records.filter(status=status_filter)

        records=records.order_by("-created_at")
        serializer=EmissionRecordSerializer(records,many=True)
        return Response(serializer.data)


class ApproveRecordView(APIView):

    def post(self,request,record_id):
        try:
            record=EmissionRecord.objects.get(id=record_id)

        except EmissionRecord.DoesNotExist:
            return Response({"error":"Record not found"},status=404)

        if record.is_locked:
            return Response({"error":"Record already locked"},status=400)

        record.status="approved"
        record.is_locked=True
        record.approved_at=timezone.now()
        record.save()

        AuditLog.objects.create(
            record=record,
            action="approved",
            performed_by="analyst"
        )

        return Response({
            "message":"Record approved"
        })
        

class FailedRowsView(APIView):
    def get(self,request):
        rows=RawRecord.objects.filter(status="failed").order_by("-created_at")
        serializer=RawRecordSerializer(rows,many=True)
        return Response(serializer.data)