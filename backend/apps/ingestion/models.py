from django.db import models
from apps.organizations.models import Organization

class DataSource(models.Model):
    SOURCE_TYPES=(
        ("sap","SAP"),
        ("utility","Utility"),
        ("travel","Travel"),
    )

    organization=models.ForeignKey(Organization,on_delete=models.CASCADE)
    source_type=models.CharField(max_length=20,choices=SOURCE_TYPES)
    file=models.FileField(upload_to="uploads/")
    uploaded_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.organization.name} - {self.source_type}"
    

class RawRecord(models.Model):
    STATUS_CHOICES=(
        ("pending","Pending"),
        ("processed","Processed"),
        ("failed","Failed"),
    )

    source=models.ForeignKey(DataSource,on_delete=models.CASCADE)
    raw_data=models.JSONField()
    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default="pending")
    error_message=models.TextField(blank=True,null=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RawRecord {self.id}"