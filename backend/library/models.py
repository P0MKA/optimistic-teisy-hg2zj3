from django.db import models


class Author(models.Model):
    name = models.CharField(max_length=64)
    birthday_year = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.name}'


class Book(models.Model):
    name = models.CharField(max_length=64)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
