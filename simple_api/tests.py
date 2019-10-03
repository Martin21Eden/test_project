from .models import User
import random
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class PostTestCase(APITestCase):
    
    def setUp(self):
        self.username = 'test_' + str(random.randint(0, 100))
        self.email = 'test' + '@gmail.com'
        self.user = User.objects.create_user(username=self.username,
                                             email=self.email,
                                             password='Password1234')
        url = reverse('token_obtain_pair')
        resp = self.client.post(url, {'username': self.username,
                                      'password': 'Password1234'}, format='json')
        token = resp.data['access']
        self.auth_headers = {
            'HTTP_AUTHORIZATION': 'Bearer ' + token}
        self.client.post('/api/posts/', {'title': 'test',
                                         'content': 'test_text'},
                         format='json', **self.auth_headers)

    def test_create_post(self):
        response = self.client.post('/api/posts/', {'title': 'test',
                                                    'content': 'test_text'},
                                    format='json', **self.auth_headers)
        self.id_post = response.data['id']
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'test')

    def test_update_post(self):
        response = self.client.patch('/api/posts/1/', {'id': 1,
                                                       'title': 'new_title',
                                                       'content': 'new_text'},
                                     format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'new_title')

    def test_like_post(self):
        response = self.client.get('/api/posts/1/like/', format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get('/api/posts/1/', **self.auth_headers)
        self.assertEqual(response.data['like'], 1)

    def test_unlike_post(self):
        response = self.client.get('/api/posts/1/unlike/', format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get('/api/posts/1/', **self.auth_headers)
        self.assertEqual(response.data['like'], 0)
        self.assertEqual(response.data['unlike'], 1)

    def test_delete_post(self):
        response = self.client.delete('/api/posts/1/', format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get('/api/posts/', **self.auth_headers)
        self.assertEqual(response.data, [])


class UserTestCase(APITestCase):
    
    def setUp(self):
        self.username = 'test_' + str(random.randint(0, 100))
        self.email = 'test' + '@gmail.com'
        self.user = User.objects.create_user(username=self.username,
                                             email=self.email,
                                             password='Password1234')
        url = reverse('token_obtain_pair')
        resp = self.client.post(url, {'username': self.username,
                                      'password': 'Password1234'}, format='json')
        self.token = resp.data['access']
        self.refresh_token = resp.data['refresh']
        self.auth_headers = {
            'HTTP_AUTHORIZATION': 'Bearer ' + self.token}

    def test_create_user(self):
        data = {'username': 'test',
                'email': 'test@test.com',
                'first_name': 'test',
                'last_name': 'test',
                'password': 'Password1234'}
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.get(username='test').username, 'test')

    def test_update_user(self):
        response = self.client.patch('/api/users/1/', {'first_name': 'test_name'},
                                     format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'test_name')

    def test_refresh_token(self):
        response = self.client.post('/api/token/refresh/', {'refresh': self.refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data['access'], self.token)
        self.token = response.data['access']

    def test_delete_user(self):
        response = self.client.delete('/api/users/1/', format='json', **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get('/api/users/')
        self.assertEqual(response.data, [])
