from django.urls import path

from .views import (
    GroupListAPIView,
    GroupCreateAPIView,
    GroupDeleteAPIView,
    GroupUpdateAPIView,
    GroupDetailAPIView,
    QuestionListAPIView,
    QuestionCreateAPIView,
    QuestionUpdateAPIView,
    QuestionDetailAPIView,
    QuestionDeleteAPIView,
    AnswerListAPIView,
    AnswerCreateAPIView,
    AnswerUpdateAPIView,
    AnswerDetailAPIView,
    AnswerDeleteAPIView
)

urlpatterns = [
    path('groups/', GroupListAPIView.as_view(), name='groups-list'),
    path('groups/create/', GroupCreateAPIView.as_view(), name='groups-create'),
    path('groups/<int:pk>/detail/', GroupDetailAPIView.as_view(), name='groups-detail'),
    path('groups/<int:pk>/update/', GroupUpdateAPIView.as_view(), name='groups-update'),
    path('groups/<int:pk>/delete/', GroupDeleteAPIView.as_view(), name='groups-delete'),
    path('questions/<int:group_id>/', QuestionListAPIView.as_view(), name='questions-list'),
    path('questions/<int:group_id>/create/', QuestionCreateAPIView.as_view(), name='questions-create'),
    path('questions/<int:pk>/detail/', QuestionDetailAPIView.as_view(), name='questions-detail'),
    path('questions/<int:pk>/update/', QuestionUpdateAPIView.as_view(), name='questions-update'),
    path('questions/<int:pk>/delete/', QuestionDeleteAPIView.as_view(), name='questions-delete'),
    path('answers/<int:question_id>/', AnswerListAPIView.as_view(), name='answers-list'),
    path('answers/<int:question_id>/create/', AnswerCreateAPIView.as_view(), name='answers-create'),
    path('answers/<int:pk>/detail/', AnswerDetailAPIView.as_view(), name='answers-detail'),
    path('answers/<int:pk>/update/', AnswerUpdateAPIView.as_view(), name='answers-update'),
    path('answers/<int:pk>/delete/', AnswerDeleteAPIView.as_view(), name='answers-delete'),
]
