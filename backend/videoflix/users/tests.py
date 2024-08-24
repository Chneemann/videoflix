from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()

class UserTests(TestCase):
    def setUp(self):
        """
        Initializes the APIClient and creates test users. Authenticates a user for the tests.
        """
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.user2 = User.objects.create_user(username='testuser2', password='testpass2')

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
        self.assertEqual(User.objects.count(), 3)
        self.assertEqual(User.objects.get(username='testuser3').username, 'testuser3')

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
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    def test_get_user_detail_not_found(self):
        """
        Tests whether a GET request to /users/<id>/ for a non-existent user returns a 404 Not Found response.
        """
        url = reverse('user_detail', args=[9999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
