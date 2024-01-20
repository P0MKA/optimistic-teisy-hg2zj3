from typing import List

import pytest

from library.models import Author, Book


@pytest.mark.django_db
def test_get_book_works_well(
        author: Author,
        books: List[Book],
):
    """
    Тут скучный тест метода модели, что-то делаем и получаем ожидаемые результаты. Тоска одним словом,
    но надо стремиться покрывать код тестами, как указано в ТЗ, а там точно надо будет 100+ %
    Хорошо бы еще попытаться сломать работу метода, творя беспредел =)
    """
    author_books = author.get_books()

    assert author_books.count() == len(books)

    for book in books:
        assert book.author == author
        assert book in author_books

    author_books.delete()

    assert author.get_books().count() == 0

    # если метод должен вызвать исключение, его нужно вызывать обернутым в менеджер контекста with pytest.raises as
    # теперь если исключение не появится, тест не пройдёт
    with pytest.raises(Exception) as e:
        author.get_books('Случайная ошибка')

        assert str(e.value) == 'Случайная ошибка'


@pytest.mark.django_db
def test_mocked_get_book(
        mocker,  # чтобы появилась фикстура mocker, надо поставить плагин pytest-mock )))
        author: Author,
):
    """
    Самое веселое и непонятное - это конечно же mock =)
    заменим заглушкой метод get_books, чтобы вместо запроса к базе он просто приветствовал тебя
    """
    mocked_method = mocker.patch.object(author, 'get_books', return_value='Hello teisy!')
    author_books = author.get_books()

    mocked_method.assert_called_once()     # убедимся, что метод-заглушка был вызван во время теста
    assert mocked_method.call_count == 1   # и еще разок =)
    assert author_books == 'Hello teisy!'  # Привет! ❤️
