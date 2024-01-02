from rest_framework.permissions import BasePermission, IsAdminUser
from rest_framework.viewsets import ModelViewSet

from library.models import Author, Book
from library.serializers import AuthorSerializer, BookSerializer


class AuthorModelViewSet(ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminUser]


class BookModelViewSet(ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
