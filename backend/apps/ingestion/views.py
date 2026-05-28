import csv
import io

from rest_framework.views import APIView
from rest_framework.response import Response
from apps.organizations.models import Organization
from apps.ingestion.models import DataSource,RawRecord
from apps.emissions.models import EmissionRecord
from .serializers import UploadSerializer


class UploadCSVView(APIView):
    def post(self,request):
        serializer=UploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors,status=400)

        try:
            organization=Organization.objects.get(
                id=serializer.validated_data["organization_id"]
            )

        except Organization.DoesNotExist:
            return Response(
                {"error":"Organization not found"},
                status=404
            )

        file=serializer.validated_data["file"]
        decoded_file=file.read().decode("utf-8-sig")
        source=DataSource.objects.create(
            organization=organization,
            source_type=serializer.validated_data["source_type"],
            file=file
        )

        reader=csv.DictReader(io.StringIO(decoded_file))

        created_records=0
        failed_records=0

        for row in reader:
            try:

                raw_record=RawRecord.objects.create(
                    source=source,
                    raw_data=row,
                    status="processed"
                )

                normalized=self.normalize_row(
                    row,
                    source.source_type
                )

                EmissionRecord.objects.create(
                    organization=organization,
                    raw_record=raw_record,
                    scope=normalized["scope"],
                    category=normalized["category"],
                    activity_type=normalized["activity_type"],
                    quantity=normalized["quantity"],
                    unit=normalized["unit"],
                    normalized_quantity=normalized["normalized_quantity"],
                    normalized_unit=normalized["normalized_unit"],
                    co2e=normalized["co2e"],
                    suspicious=normalized["suspicious"],
                    suspicious_reason=normalized["suspicious_reason"]
                )

                created_records+=1

            except Exception as e:

                RawRecord.objects.create(
                    source=source,
                    raw_data=row,
                    status="failed",
                    error_message=str(e)
                )

                failed_records+=1

        return Response({
            "message":"Upload successful",
            "records_created":created_records,
            "failed_records":failed_records
        })


    def safe_float(self,value):
        try:
            return float(value)

        except:
            return 0


    def normalize_row(self,row,source_type):
        if source_type=="sap":
            quantity=self.safe_float(
                row.get("Quantity")
                or row.get("MENGE")
            )
            unit=(
                row.get("Unit")
                or row.get("EINHEIT")
                or "L"
            )
            fuel_type=(
                row.get("Fuel Type")
                or row.get("KRAFTSTOFF")
                or "Unknown"
            )

            suspicious=False
            reason=""

            valid_units=["L","GAL"]

            if quantity<0:
                suspicious=True
                reason="Negative fuel quantity"

            elif unit not in valid_units:
                suspicious=True
                reason="Unsupported fuel unit"

            elif quantity>100000:
                suspicious=True
                reason="Unusually high fuel quantity"

            normalized_quantity=quantity

            if unit=="GAL":
                normalized_quantity=quantity*3.78541

            emission_factor={
                "Diesel":2.5,
                "Petrol":2.3
            }.get(fuel_type,2.0)

            return {
                "scope":"Scope 1",
                "category":"Fuel",
                "activity_type":fuel_type,
                "quantity":quantity,
                "unit":unit,
                "normalized_quantity":normalized_quantity,
                "normalized_unit":"L",
                "co2e":normalized_quantity*emission_factor,
                "suspicious":suspicious,
                "suspicious_reason":reason
            }

        if source_type=="utility":
            quantity=self.safe_float(row.get("kWh"))
            suspicious=False
            reason=""

            if quantity<0:
                suspicious=True
                reason="Negative electricity usage"

            elif quantity>50000:
                suspicious=True
                reason="Unusually high electricity usage"

            return {
                "scope":"Scope 2",
                "category":"Electricity",
                "activity_type":"Electricity Usage",
                "quantity":quantity,
                "unit":"kWh",
                "normalized_quantity":quantity,
                "normalized_unit":"kWh",
                "co2e":quantity*0.4,
                "suspicious":suspicious,
                "suspicious_reason":reason
            }

        if source_type=="travel":
            distance=self.safe_float(row.get("Distance"))
            travel_type=row.get("Travel Type","Flight")
            suspicious=False
            reason=""

            if distance<0:
                suspicious=True
                reason="Negative travel distance"

            elif distance>20000:
                suspicious=True
                reason="Unusually large travel distance"

            emission_factor={
                "Flight":0.2,
                "Hotel":15,
                "Cab":0.1
            }.get(travel_type,0.15)

            if travel_type=="Hotel":
                unit="nights"
            else:
                unit="km"

            return {
                "scope":"Scope 3",
                "category":"Business Travel",
                "activity_type":travel_type,
                "quantity":distance,
                "unit":unit,
                "normalized_quantity":distance,
                "normalized_unit":unit,
                "co2e":distance*emission_factor,
                "suspicious":suspicious,
                "suspicious_reason":reason
            }