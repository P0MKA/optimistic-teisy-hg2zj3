from django.contrib import admin
from library.models import Book, Author


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    ...


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    ...
