from rest_framework.generics import (
    ListAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    DestroyAPIView,
    CreateAPIView
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
    IsAdminUser
)
from rest_framework.filters import (
    SearchFilter,
    OrderingFilter
)

from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from .models import Group, Question, Answer
from .serializers import (
    GroupSerializer,
    QuestionSerializer,
    QuestionDetailSerializer,
    AnswerSerializer,
)


@login_required
def home(request):
    groups = Group.objects.all()
    context = {
        'groups': groups
    }
    return render(request, 'dialogs/index.html', context=context)


class GroupListAPIView(ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = [SearchFilter, ]


class GroupDetailAPIView(RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class GroupUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, ]


class GroupDeleteAPIView(DestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class GroupCreateAPIView(CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated, ]


class QuestionListAPIView(ListAPIView):
    serializer_class = QuestionSerializer
    filter_backends = [SearchFilter, ]

    def get_queryset(self):
        group_id = self.kwargs['group_id']
        queryset = Question.objects.filter(group=group_id)
        return queryset


class QuestionDetailAPIView(RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionDetailSerializer


class QuestionUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, ]


class QuestionDeleteAPIView(DestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class QuestionCreateAPIView(CreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated, ]

    def perform_create(self, serializer):
        group = Group.objects.get(id=self.kwargs['group_id'])
        serializer.save(group=group)


class AnswerListAPIView(ListAPIView):
    serializer_class = AnswerSerializer
    filter_backends = [SearchFilter, ]

    def get_queryset(self):
        question_id = self.kwargs['question_id']
        queryset = Answer.objects.filter(question=question_id)
        return queryset


class AnswerDetailAPIView(RetrieveAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class AnswerUpdateAPIView(RetrieveUpdateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, ]


class AnswerDeleteAPIView(DestroyAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class AnswerCreateAPIView(CreateAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated, ]

    def perform_create(self, serializer):
        question = Question.objects.get(id=self.kwargs['question_id'])
        serializer.save(question=question)
