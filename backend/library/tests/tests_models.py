from typing import List

import pytest

from library.models import Author, Book


@pytest.mark.django_db
def test_get_book(
        author: Author,
        books: List[Book],
):
    author_books = author.get_books()

    assert author_books.count() == len(books)

    for book in books:
        assert book.author == author
        assert book in author_books

    author_books.delete()

    assert author.get_books().count() == 0


@pytest.mark.django_db
def test_mocked_get_book(
        mocker,  # чтобы появилась фикстура mocker, надо поставить плагин pytest-mock )))
        author: Author,
):
    mocked_method = mocker.patch.object(author, 'get_books', return_value=['Hello teisy!'])
    author_books = author.get_books()

    mocked_method.assert_called_once()
    assert mocked_method.call_count == 1
    assert author_books == ['Hello teisy!']
