from rest_framework import serializers
from .models import RawRecord

class UploadSerializer(serializers.Serializer):
    organization_id=serializers.IntegerField()
    source_type=serializers.CharField()
    file=serializers.FileField()
    

class RawRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model=RawRecord
        fields="__all__"