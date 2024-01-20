"""
Ты уже познакомилась с фикстурами pytest, https://pytest-docs-ru.readthedocs.io/ru/latest/fixture.html
Их можно определять и в самих файлах тестов, но чтобы многократно использовать фикстуры,
не прибегая к импортам, их размещают в файле conftest.py
"""

from typing import Tuple

import pytest
from django.contrib.auth.models import User
from django.core.management import call_command
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

TEST_USER = 'test_user'
ADMIN_NAME = 'admin'
TEST_PASSWORD = 'password'


@pytest.fixture(scope='session')  # function, class, module, package, session
def django_db_setup(django_db_setup, django_db_blocker):
    """
    Фикстуры pytest нужны, чтобы создавать тестовые сущности, а их в свою очередь можно загрузить из файлов
    фикстур django прямо в тестовую бд, всё как ты любишь ❤️
    В декораторе можно указать область применения фикстуры, будет ли она пересоздаваться для каждой тестовой функции или же
    использоваться для всей тестовой сессии

    взято отсюда
    https://pytest-django.readthedocs.io/en/latest/database.html#populate-the-test-database-if-you-don-t-use-transactional-or-live-server
    """

    with django_db_blocker.unblock():
        call_command('loaddata', 'fixtures/authors.json')
        call_command('loaddata', 'fixtures/books.json')


@pytest.fixture
def anon_client() -> APIClient:  # твой любименький клиент для API, о котором рассказывал Нагорный
    return APIClient()


@pytest.fixture
def user() -> User:
    test_user = User.objects.create_user(username=TEST_USER)
    return test_user


@pytest.fixture
def admin() -> User:
    test_admin = User.objects.create_superuser(ADMIN_NAME, is_superuser=True, is_staff=True)
    return test_admin


@pytest.fixture
def client(user: 'User', anon_client: 'APIClient') -> Tuple[User, APIClient]:
    # фикстуры можно использовать в других фикстурах, передавая их в качестве аргументов, как и в тестах

    # а дальше три вида авторизации для разных случаев =) можно одновременно пройти все три
    anon_client.force_authenticate(user)   # авторизация для апишек DRF
    
    anon_client.force_login(user)          # авторизация для вьюшек Django
    
    refresh = RefreshToken.for_user(user)  # авторизация по JWT-токену
    anon_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    
    return user, anon_client  # тут достаточно вернуть только anan_client, но пусть будет и user


@pytest.fixture
def admin_client(admin: 'User', anon_client: 'APIClient') -> Tuple[User, APIClient]:
    anon_client.force_authenticate(admin)

    refresh = RefreshToken.for_user(admin)
    anon_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    return admin, anon_client


@pytest.fixture
def user_with_password(user: 'User'):
    user.set_password(TEST_PASSWORD)  # пароль для force_authenticate в общем-то и не нужен, но для тестов авторизации
    user.save()                       # лишним не будет =)
    return user
