from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from .models import ITNArticle
from .serializers import ContactSerializer
from .services.itn import remove_article


@api_view(["POST"])
@permission_classes([AllowAny])
def contact_api_view(request: Request):
    serializer = ContactSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    EmailMessage(
        subject=serializer.data["subject"] or "Contact Form",
        body=serializer.data["message"],
        from_email=settings.EMAIL_SENDER_NO_REPLY,
        to=[settings.EMAIL_FEEDBACK],
        reply_to=[serializer.data["email"]],
    ).send()

    return Response(status=status.HTTP_201_CREATED)


@api_view(["POST"])
def remove_article_api_view(request, pk):
    """
    Boots/Bury post
    """

    article = get_object_or_404(ITNArticle, pk=pk)

    if not request.user.is_superuser or not request.user.is_staff:
        raise PermissionDenied("You do not have permission to perform this action")

    remove_article(article)

    return Response(status=status.HTTP_204_NO_CONTENT)
