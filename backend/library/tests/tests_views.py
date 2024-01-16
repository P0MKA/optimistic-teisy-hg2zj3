from typing import Tuple

import pytest
from django.contrib.auth.models import User

from rest_framework.test import APIClient
from rest_framework import status

from library.models import Book, Author

AUTHORS_API_URL = '/api/authors/'
BOOKS_API_URL = '/api/books/'


class TestAuthorsAPIView:
    @pytest.mark.django_db
    def test_get_authors_view_from_user(
            self,
            client: Tuple[User, APIClient],
    ):
        _, user = client
        response = user.get(AUTHORS_API_URL)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    @pytest.mark.django_db
    def test_get_authors_view_from_admin(
            self,
            admin_client: Tuple[User, APIClient],
    ):
        _, admin = admin_client
        admin_response = admin.get(AUTHORS_API_URL)

        assert admin_response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
def test_books_create(
        books_author: Author,
        admin_client: Tuple[User, APIClient],
):
    _, admin = admin_client

    books_count = Book.objects.count()
    authors_count = Author.objects.count()

    new_book_name = 'Русские сказки'
    expected_book = Book.objects.filter(name=new_book_name).first()

    assert not expected_book

    book_data = {
        'name': new_book_name,
        'author': books_author.pk,
    }

    response = admin.post(
        BOOKS_API_URL,
        data=book_data,
        format='json',
    )

    assert response.status_code == status.HTTP_201_CREATED
    assert Book.objects.count() == books_count + 1
    assert Author.objects.count() == authors_count

    books_list = Book.objects.values_list('name', flat=True)
    new_book = Book.objects.last()

    assert new_book_name in books_list
    assert new_book.author == books_author
    assert new_book.name == new_book_name
