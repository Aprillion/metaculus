from typing import Callable

from django.db.models import QuerySet
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from projects.models import Project
from projects.serializers import (
    TopicSerializer,
    CategorySerializer,
    TournamentSerializer,
    TagSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def topics_list_api_view(request: Request):
    qs = Project.objects.filter_topic().filter_active().annotate_posts_count()

    data = [
        {**TopicSerializer(obj).data, "posts_count": obj.posts_count}
        for obj in qs.all()
    ]

    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def categories_list_api_view(request: Request):
    qs = (
        Project.objects.filter_category()
        .filter_active()
        .annotate_posts_count()
        .order_by("-posts_count")
    )

    data = [
        {**CategorySerializer(obj).data, "posts_count": obj.posts_count}
        for obj in qs.all()
    ]

    return Response(data)


def enrich_tournaments_with_posts_count(
    qs: QuerySet,
) -> tuple[QuerySet, Callable[[Project, dict], dict]]:
    """
    Enriches tournament with posts count.
    """

    qs = qs.annotate_posts_count()

    def enrich(obj: Project, serialized_obj: dict):
        serialized_obj["posts_count"] = obj.posts_count

        return serialized_obj

    return qs, enrich


@api_view(["GET"])
@permission_classes([AllowAny])
def tags_list_api_view(request: Request):
    qs = Project.objects.filter_tags().filter_active().annotate_posts_count()
    search_query = serializers.CharField(allow_null=True, min_length=3).run_validation(
        request.query_params.get("search")
    )

    if search_query:
        qs = qs.filter(name__icontains=search_query)
    else:
        qs = qs.order_by("-posts_count")

    # Limit to 50 tags
    qs = qs[:50]

    data = [
        {**TagSerializer(obj).data, "posts_count": obj.posts_count} for obj in qs.all()
    ]

    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def tournaments_list_api_view(request: Request):
    qs = (
        Project.objects.filter_tournament()
        .filter_active()
        .annotate_posts_count()
        .order_by("-posts_count")
    )

    qs, enrich_posts_count = enrich_tournaments_with_posts_count(qs)

    data = []

    for obj in qs.all():
        serialized_tournament = TournamentSerializer(obj).data

        serialized_tournament = enrich_posts_count(obj, serialized_tournament)

        data.append(serialized_tournament)

    return Response(data)


@api_view(["GET"])
@permission_classes([AllowAny])
def tournament_by_slug_api_view(request: Request, slug: str):
    qs = Project.objects.filter_tournament()
    qs, enrich_posts_count = enrich_tournaments_with_posts_count(qs)

    obj = get_object_or_404(qs, slug=slug)

    data = TournamentSerializer(obj).data
    data = enrich_posts_count(obj, data)

    return Response(data)
