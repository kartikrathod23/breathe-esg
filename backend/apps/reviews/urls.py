from django.urls import path
# from .views import ReviewRecordsView,ApproveRecordView
from .views import ReviewRecordsView,ApproveRecordView,FailedRowsView

urlpatterns=[
    path("records/",ReviewRecordsView.as_view()),
    path("approve/<int:record_id>/",ApproveRecordView.as_view()),
    path("failed-rows/",FailedRowsView.as_view()),
]