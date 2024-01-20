import pytest
from typing import TYPE_CHECKING
# интересная константа из модуля typing
# когда код запускается, TYPE_CHECKING == False
# и лишние импорты для type-hint'ов не производятся, в основном это сделано для решения проблемы круговых импортов
# когда же ты только пишешь код, TYPE_CHECKING == True и IDE по полной использует type-hint'ы, подсказывая тебе
# всякие методы классов из аргументов =) ну ты помнишь
# https://docs-python.ru/standart-library/modul-typing-python/pomoschniki-samoanaliza-modulja-typing/#typing.TYPE_CHECKING

if TYPE_CHECKING:
    from django.contrib.auth.models import User
    from rest_framework.test import APIClient

from conftest import TEST_PASSWORD

INCORRECT_PASSWORD = 'incorrect_password'
EXPECTED_REDIRECT_URL = '/accounts/profile/'


@pytest.mark.django_db
def test_auth_using_login_pass(anon_client: 'APIClient', user_with_password: 'User'):
    anon_client.logout()
    username = user_with_password.username
    response = anon_client.post(
        '/api-auth/login/',
        data={'username': username, 'password': INCORRECT_PASSWORD},
    )
    assert response.status_code == 200

    response_data = response.content.decode('utf-8')

    assert 'Please enter a correct username and password.' in response_data

    response = anon_client.post(
        path='/api-auth/login/',
        data={'username': username, 'password': TEST_PASSWORD},
        follow=False  # параметр, который позволяет сразу переходить по ссылке, если код ответа redirect 302
    )
    assert response.status_code == 302
    assert response.url == EXPECTED_REDIRECT_URL

    response = anon_client.post(
        path='/api-auth/login/',
        data={'username': username, 'password': TEST_PASSWORD},
        follow=True  # сразу переходить, если он в True, конечно =)
    )
    assert response.status_code == 404  # почему тут 404 ?
