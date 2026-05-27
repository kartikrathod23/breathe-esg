from django.db import models
from apps.emissions.models import EmissionRecord

class AuditLog(models.Model):
    record=models.ForeignKey(EmissionRecord,on_delete=models.CASCADE)
    action=models.CharField(max_length=100)
    performed_by=models.CharField(max_length=100)
    timestamp=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.action