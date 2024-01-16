from django.db import models
from django.db.models import QuerySet


class Author(models.Model):
    name = models.CharField(max_length=64)
    birthday_year = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.name}'

    def get_books(self) -> QuerySet['Book']:
        return Book.objects.filter(author=self).all()


class Book(models.Model):
    name = models.CharField(max_length=64)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
