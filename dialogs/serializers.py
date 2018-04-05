from rest_framework import serializers

from .models import Group, Question, Answer


class GroupSerializer(serializers.ModelSerializer):
    update_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:groups-update',
        lookup_field='pk',
    )
    delete_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:groups-delete',
        lookup_field='pk',
    )
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = (
            'id',
            'name',
            'description',
            #  'created_at',
            #  'updated_at',
            'update_url',
            'delete_url',
            'questions',
        )

    def get_questions(self, obj):
        questions_qs = Question.objects.filter(group=obj.id)
        questions = QuestionSerializer(questions_qs, many=True, context={
            'request': self.context['request']
        }).data
        return questions


class QuestionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:questions-detail',
        lookup_field='pk',
    )
    delete_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:questions-delete',
        lookup_field='pk',
    )

    class Meta:
        model = Question
        fields = (
            'id',
            'text',
            #  'created_at',
            #  'updated_at',
            'url',
            'delete_url',
        )


class QuestionDetailSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:questions-detail',
        lookup_field='pk',
    )
    update_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:questions-update',
        lookup_field='pk',
    )
    delete_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:questions-delete',
        lookup_field='pk',
    )
    answers = serializers.SerializerMethodField()
    incomes = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            'id',
            'text',
            #  'created_at',
            #  'updated_at',
            'url',
            'update_url',
            'delete_url',
            'answers',
            'incomes',
        )

    def get_answers(self, obj):
        answers_qs = Answer.objects.filter(question=obj.id)
        answers = AnswerSerializer(answers_qs, many=True, context={
            'request': self.context['request']
        }).data
        return answers

    def get_incomes(self, obj):
        incomes_qs = Answer.objects.filter(outcome=obj.id)
        incomes = AnswerSerializer(incomes_qs, many=True, context={
            'request': self.context['request']
        }).data
        return incomes


class AnswerSerializer(serializers.ModelSerializer):
    update_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:answers-update',
        lookup_field='pk',
    )
    delete_url = serializers.HyperlinkedIdentityField(
        view_name='api-dialogs:answers-delete',
        lookup_field='pk',
    )
    question = QuestionSerializer(read_only=True)
    outcome_obj = serializers.SerializerMethodField()
    #  outcome_id = serializers.SerializerMethodField()

    class Meta:
        model = Answer
        fields = (
            'id',
            'text',
            #  'created_at',
            #  'updated_at',
            'update_url',
            'delete_url',
            'question',
            'outcome',
            'outcome_obj',
        )

    def get_outcome_obj(self, obj):
        outcome_qs = Question.objects.filter(income=obj.id)
        outcome = False
        if len(outcome_qs) == 1:
            outcome = QuestionSerializer(outcome_qs[0], context={
            'request': self.context['request']
        }).data
        return outcome
