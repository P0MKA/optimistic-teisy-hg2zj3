import pytest
from typing import TYPE_CHECKING

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
        '/api-auth/login/', data={'username': username, 'password': TEST_PASSWORD}
    )
    assert response.status_code == 302
    assert response.url == EXPECTED_REDIRECT_URL
