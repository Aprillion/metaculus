from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from users.models import User
from .constants import ResolutionType
from .models import Question, Conditional, GroupOfQuestions
from .services import build_question_forecasts, build_question_forecasts_for_user


class QuestionSerializer(serializers.ModelSerializer):
    post_id = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = (
            "id",
            "title",
            "min",
            "max",
            "description",
            "created_at",
            "open_time",
            "scheduled_resolve_time",
            "actual_resolve_time",
            "resolution_set_time",
            "scheduled_close_time",
            "actual_close_time",
            "forecast_scoring_ends",
            "type",
            "options",
            "possibilities",
            "resolution",
            "zero_point",
            "post_id",
            "resolution_criteria_description",
            "fine_print",
            "label",
        )

    def get_post_id(self, obj):
        if obj.get_post():
            return obj.get_post().id
        return None


class QuestionWriteSerializer(serializers.ModelSerializer):
    scheduled_resolve_time = serializers.DateTimeField(required=True)
    scheduled_close_time = serializers.DateTimeField(required=True)

    class Meta:
        model = Question
        fields = (
            "title",
            "description",
            "type",
            "possibilities",
            "resolution",
            "max",
            "min",
            "zero_point",
            "open_upper_bound",
            "open_lower_bound",
            "options",
            "scheduled_resolve_time",
            "scheduled_close_time",
        )

    def validate(self, data: dict):
        if data["scheduled_resolve_time"] <= data["scheduled_close_time"]:
            raise ValidationError(
                {
                    "scheduled_resolve_time": [
                        "The expected resolve date should be after the question closes."
                    ]
                }
            )

        return data


class ConditionalSerializer(serializers.ModelSerializer):
    """
    Contains basic info about conditional questions
    """

    class Meta:
        model = Conditional
        fields = ("id",)


class ConditionalWriteSerializer(serializers.ModelSerializer):
    condition_id = serializers.IntegerField()
    condition_child_id = serializers.IntegerField()

    class Meta:
        model = Conditional
        fields = ("condition_id", "condition_child_id")

    def validate_condition_id(self, value):
        question = Question.objects.filter(pk=value).first()

        if not question:
            raise ValidationError("Condition does not exist")

        if question.type != Question.QuestionType.BINARY:
            raise ValidationError("Condition can only be binary question")

        return value

    def validate_condition_child_id(self, value):
        question = Question.objects.filter(pk=value).first()

        if not question:
            raise ValidationError("Condition Child does not exist")

        return value


class GroupOfQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupOfQuestions
        fields = (
            "id",
            "description",
            "resolution_criteria_description",
            "fine_print",
            "group_variable",
        )


class GroupOfQuestionsWriteSerializer(serializers.ModelSerializer):
    questions = QuestionWriteSerializer(many=True, required=True, partial=True)

    class Meta:
        model = GroupOfQuestions
        fields = ("questions",)


def serialize_question(
    question: Question,
    with_forecasts: bool = False,
    current_user: User = None,
):
    """
    Serializes question object
    """

    serialized_data = QuestionSerializer(question).data

    if with_forecasts:
        serialized_data["forecasts"] = build_question_forecasts(question)

        if current_user and not current_user.is_anonymous:
            serialized_data["my_forecasts"] = build_question_forecasts_for_user(
                question, current_user
            )

    serialized_data["resolution"] = question.resolution

    return serialized_data


def serialize_conditional(
    conditional: Conditional, with_forecasts: bool = False, current_user: User = None
):
    # Serialization of basic data
    serialized_data = ConditionalSerializer(conditional).data

    # Generic questions
    serialized_data["condition"] = serialize_question(
        conditional.condition, with_forecasts=False
    )
    serialized_data["condition_child"] = serialize_question(
        conditional.condition_child, with_forecasts=False
    )

    # Autogen questions
    serialized_data["question_yes"] = serialize_question(
        conditional.question_yes,
        with_forecasts=with_forecasts,
        current_user=current_user,
    )
    serialized_data["question_no"] = serialize_question(
        conditional.question_no,
        with_forecasts=with_forecasts,
        current_user=current_user,
    )

    return serialized_data


def serialize_group(
    group: GroupOfQuestions, with_forecasts: bool = False, current_user: User = None
):
    # Serialization of basic data
    serialized_data = GroupOfQuestionsSerializer(group).data
    serialized_data["questions"] = []

    for question in group.questions.all():
        serialized_data["questions"].append(
            serialize_question(
                question, with_forecasts=with_forecasts, current_user=current_user
            )
        )

    return serialized_data


def validate_question_resolution(question: Question, resolution: str):
    if resolution in ResolutionType:
        return resolution

    if question.type == Question.QuestionType.BINARY:
        return serializers.ChoiceField(choices=["yes", "no"]).run_validation(resolution)

    if question.type == Question.QuestionType.NUMERIC:
        resolution = serializers.FloatField().run_validation(resolution)

        if resolution > question.max or resolution < question.min:
            raise ValidationError(
                f"Resolution must be between {question.min} and {question.max}"
            )

        return resolution

    if question.type == Question.QuestionType.DATE:
        return serializers.DateField().run_validation(resolution)

    if question.type == Question.QuestionType.MULTIPLE_CHOICE:
        return serializers.ChoiceField(choices=question.options)
