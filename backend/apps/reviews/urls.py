from django.urls import path
from .views import ReviewRecordsView,ApproveRecordView,FailedRowsView,RejectRecordView

urlpatterns=[
    path("records/",ReviewRecordsView.as_view()),
    path("approve/<int:record_id>/",ApproveRecordView.as_view()),
    path("reject/<int:record_id>/",RejectRecordView.as_view()),
    path("failed-rows/",FailedRowsView.as_view()),
]