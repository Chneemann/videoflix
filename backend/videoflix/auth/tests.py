from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from users.models import CustomUser

class AuthTests(APITestCase):
    """
    Prepares the test environment by creating an active user and an authentication token.
    """
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )
        self.user.is_active = True
        self.user.save()
        self.token = Token.objects.create(user=self.user)

    def test_login(self):
        """
        Tests whether an active user can log in successfully.
        """
        url = reverse('login')
        data = {'email': 'testuser@example.com', 'password': 'testpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_inactive_user(self):
        """
        Tests that an inactive user cannot log in.
        """
        self.user.is_active = False
        self.user.save()
        url = reverse('login')
        data = {'email': 'testuser@example.com', 'password': 'testpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_register(self):
        """
        Tests the registration of a new user and their inactivity after registration.
        """
        url = reverse('register')
        data = {'email': 'newuser@example.com', 'password': 'newpass', 'username': 'newuser'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertFalse(CustomUser.objects.get(email='newuser@example.com').is_active)

    def test_register_existing_user(self):
        """
        Tests that registration with an existing e-mail fails.
        """
        url = reverse('register')
        data = {'email': 'testuser@example.com', 'password': 'newpass'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_email(self):
        """
        Tests email verification for an inactive user.
        """
        self.user.is_active = False
        self.user.verify_email_token = 'validtoken'
        self.user.save()
        url = reverse('verify_email')
        data = {'email': 'testuser@example.com', 'token': 'validtoken'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

    def test_verify_email_already_active(self):
        """
        Tests that an already active user receives an error message during e-mail verification.
        """
        email = 'testuser@example.com'
        token = 'anytoken'
        user = CustomUser.objects.create(email=email, verify_email_token=token, is_active=True)
        url = reverse('verify_email')
        data = {'email': email, 'token': token}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_verify_email_invalid(self):
        """
        Tests the e-mail verification with invalid data.
        """
        url = reverse('verify_email')
        data = {'email': 'invalid@example.com', 'token': 'invalidtoken'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_forgot_password(self):
        """
        Tests the forget password functionality and the generation of a new token.
        """
        url = reverse('forgot_password')
        data = {'email': 'testuser@example.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertIsNotNone(self.user.verify_email_token)

    def test_forgot_password_invalid_email(self):
        """
        Tests the forgot password functionality with an invalid e-mail address.
        """
        url = reverse('forgot_password')
        data = {'email': 'invalid@example.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_password(self):
        """
        Tests the password change with a valid token.
        """
        self.user.verify_email_token = 'validtoken'
        self.user.save()
        url = reverse('change_password')
        data = {'email': 'testuser@example.com', 'token': 'validtoken', 'new_password': 'newpass123'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))

    def test_change_password_invalid_token(self):
        """
        Tests the password change with an invalid token.
        """
        url = reverse('change_password')
        data = {'email': 'testuser@example.com', 'token': 'invalidtoken', 'new_password': 'newpass123'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_auth_view_get_authenticated(self):
        """
        Tests access to a protected view with authentication.
        """
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        url = reverse('auth_view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_auth_view_get_unauthenticated(self):
        """
        Tests access to a protected view without authentication.
        """
        url = reverse('auth_view')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_auth_view_post_existing_user(self):
        """
        Tests access to a protected view with an existing user.
        """
        url = reverse('auth_view')
        data = {'email': 'testuser@example.com'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)