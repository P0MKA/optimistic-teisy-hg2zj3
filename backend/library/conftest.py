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
