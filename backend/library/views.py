from rest_framework import permissions
from rest_framework.permissions import BasePermission, IsAdminUser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
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


class WhoAmIView(APIView):
    '''API для получения информации о пользователе'''

    permission_classes = [permissions.IsAuthenticated]


    def get(self, request: Request):
        return Response({"username": request.user.username})