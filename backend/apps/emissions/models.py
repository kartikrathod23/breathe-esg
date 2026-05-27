from django.db import models
from apps.organizations.models import Organization
from apps.ingestion.models import RawRecord

class EmissionRecord(models.Model):
    STATUS_CHOICES=(
        ("review","Review"),
        ("approved","Approved"),
    )

    organization=models.ForeignKey(Organization,on_delete=models.CASCADE)
    raw_record=models.ForeignKey(RawRecord,on_delete=models.CASCADE)

    scope=models.CharField(max_length=20)
    category=models.CharField(max_length=100)

    activity_type=models.CharField(max_length=100)

    quantity=models.FloatField()
    unit=models.CharField(max_length=50)

    normalized_quantity=models.FloatField()
    normalized_unit=models.CharField(max_length=50)

    co2e=models.FloatField(default=0)

    suspicious=models.BooleanField(default=False)
    suspicious_reason=models.TextField(blank=True,null=True)

    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default="review")

    is_locked=models.BooleanField(default=False)
    
    approved_at=models.DateTimeField(null=True,blank=True)

    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} - {self.organization.name}"