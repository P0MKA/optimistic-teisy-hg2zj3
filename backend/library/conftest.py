"""
Для больших приложений conftest.py разрастается до таких размеров, что невозможно будет что-то найти в
этих 98719815 тысячах строк, поэтому специфичные фикстуры для отдельных приложений Django,
нужно размещать в conftest.py этих приложений

Создадим в этом файле фикстуры для моделей library.models
"""
from typing import List

import pytest

from library.models import Book, Author


@pytest.fixture
def book() -> Book:
    return Book.objects.first()


@pytest.fixture
def books_author(book: Book) -> Author:
    return book.author


@pytest.fixture
def author() -> Author:
    witcher_author = Author.objects.create(
        name="Анджей Сапковский",
        birthday_year=1948,
    )

    return witcher_author


@pytest.fixture
def books(author: Author) -> List[Book]:
    books_list = [Book(
        name=f'Witcher_{i}',
        author=author,
    ) for i in range(8)]

    Book.objects.bulk_create(books_list)

    return books_list
