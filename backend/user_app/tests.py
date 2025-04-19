from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import CustomUser

class CustomUserModelTests(TestCase):
    def test_generate_verification_token(self):
        """
        Ensure the token generated is 20 characters long and alphanumeric.
        """
        user = CustomUser(username='testuser')
        token = user.generate_verification_token()
        self.assertEqual(len(token), 20)
        self.assertTrue(token.isalnum())

    def test_save_without_token_generates_token(self):
        """
        Verify a token is assigned if not present when saving a user.
        """
        user = CustomUser(username='testuser')
        user.save()
        self.assertIsNotNone(user.verify_email_token)
        
class UserTests(TestCase):
    def setUp(self):
        """
        Initializes the APIClient and creates test users. Authenticates a user for the tests.
        """
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.user2 = CustomUser.objects.create_user(username='testuser2', password='testpass2')

    def test_get_users(self):
        """
        Checks whether the GET request to /users/ returns a 200 OK response and returns two users.
        """
        url = reverse('user_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_post_user(self):
        """
        Tests whether a POST request to /users/ creates a new user and returns a 201 Created response.
        """
        url = reverse('user_list')
        data = {'username': 'testuser3', 'password': 'testpass3'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(CustomUser.objects.get(username='testuser3').username, 'testuser3')

    def test_get_user_detail(self):
        """
        Checks whether the GET request to /users/<id>/ returns the correct user details.
        """
        url = reverse('user_detail', args=[self.user.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_put_user_detail(self):
        """
        Tests whether a PUT request to /users/<id>/ updates the user details and returns a 200 OK response.
        """
        url = reverse('user_detail', args=[self.user.pk])
        data = {'username': 'updateduser', 'password': 'newpass'}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'updateduser')

    def test_delete_user_detail(self):
        """
        Checks whether a DELETE request to /users/<id>/ deletes the user and returns a 204 No Content response.
        """
        url = reverse('user_detail', args=[self.user.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CustomUser.objects.filter(pk=self.user.pk).exists())

    def test_get_user_detail_not_found(self):
        """
        Tests whether a GET request to /users/<id>/ for a non-existent user returns a 404 Not Found response.
        """
        url = reverse('user_detail', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class UserVideosAPITest(TestCase):
    def setUp(self):
        """
        Initializes the APIClient and creates test users. Authenticates a user for the tests.
        """
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.user_liked_url = reverse('user_liked_detail', kwargs={'id': self.user.id})
        self.user_watched_url = reverse('user_watched_detail', kwargs={'id': self.user.id})

    def test_user_liked_detail_invalid_data(self):
        """
        Test for invalid data
        """
        data = {
            'liked_videos': 'invalid_data_format'
        }
        response = self.client.put(self.user_liked_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_liked_detail_user_not_found(self):
        """
        Test if user does not exist
        """
        wrong_url = reverse('user_liked_detail', kwargs={'id': 9999})
        data = {
            'liked_videos': ['video1', 'video2']
        }
        response = self.client.put(wrong_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_watched_detail_invalid_data(self):
        """
        Test for invalid data
        """
        data = {
            'watched_videos': 'invalid_data_format'
        }
        response = self.client.put(self.user_watched_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_watched_detail_user_not_found(self):
        """
        Test if user does not exist
        """
        wrong_url = reverse('user_watched_detail', kwargs={'id': 9999}) 
        data = {
            'watched_videos': ['video3', 'video4']
        }
        response = self.client.put(wrong_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)