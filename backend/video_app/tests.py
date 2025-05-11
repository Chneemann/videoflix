import os, shutil, tempfile
from django.conf import settings
from django.test import TestCase, override_settings
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock
from django.core.files.uploadedfile import SimpleUploadedFile
from .tasks import convert_video_to_hls, delete_original_video
from .models import Video
from .class_assets import VIDEO_GENRES
from user_app.models import CustomUser

@override_settings(MEDIA_ROOT=tempfile.gettempdir())
class CheckVideoResolutionsTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.video = Video.objects.create(title='Test Video', file_name='testvideo', is_available=True, creator=self.user)
        self.video_id = self.video.id

        self.video_dir = os.path.join(settings.MEDIA_ROOT, 'videos', str(self.video_id))
        os.makedirs(self.video_dir, exist_ok=True)

        with open(os.path.join(self.video_dir, 'testvideo_720p.m3u8'), 'w') as f:
            f.write('#EX1TM3U')

    def tearDown(self):
        shutil.rmtree(self.video_dir, ignore_errors=True)

    def test_check_video_resolutions(self):
        response = self.client.get(reverse('check_video_resolutions', args=[self.video_id]))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['720p'])
        self.assertFalse(response.json()['360p'])
        self.assertFalse(response.json()['1080p'])

    def test_check_video_resolutions_invalid_id(self):
        response = self.client.get(reverse('check_video_resolutions', args=[9999]))
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

class VideoListViewTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_video_list_with_no_available_videos(self):
        response = self.client.get(reverse('video_list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

class GenreListViewTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser', email='testuser@example.com', password='testpass'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_genre_list_requires_authentication(self):
        client = APIClient()
        response = client.get(reverse('genre_list'))
        self.assertEqual(response.status_code, 401)

class VideoTasksTest(TestCase):
    @patch('subprocess.run')
    def test_convert_video_to_hls(self, mock_subprocess_run):
        mock_subprocess_run.return_value = MagicMock()
        convert_video_to_hls('test/source.mp4', '1920x1080', 1)
        mock_subprocess_run.assert_called_once()
        self.assertIn('-i', mock_subprocess_run.call_args[0][0])
        self.assertIn('1920x1080', mock_subprocess_run.call_args[0][0])

    @patch('os.remove')
    def test_delete_original_video(self, mock_os_remove):
        delete_original_video('test/source.mp4')
        mock_os_remove.assert_called_once_with('test/source.mp4')

    @patch('os.remove', side_effect=FileNotFoundError)
    def test_delete_original_video_handles_missing_file(self, mock_os_remove):
        try:
            delete_original_video('nonexistent.mp4')
        except FileNotFoundError:
            self.fail("delete_original_video should handle FileNotFoundError gracefully")

class VideoUploadValidationTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='uploader', email='uploader@example.com', password='testpass'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_video_upload_missing_required_fields(self):
        required_fields = ['title', 'description', 'genre', 'file_path']
        for field in required_fields:
            with self.subTest(missing=field):
                uploaded_file = SimpleUploadedFile("video.mp4", b"dummy content", content_type="video/mp4")
                data = {
                    'title': 'Test title',
                    'description': 'Test description',
                    'genre': VIDEO_GENRES[0][0],
                    'file_path': uploaded_file,
                }
                del data[field]

                response = self.client.post(reverse('video_upload'), data, format='multipart')
                self.assertEqual(response.status_code, 400)
                self.assertIn(field, response.data)

    def test_video_upload_invalid_filetype(self):
        txt_file = SimpleUploadedFile("document.txt", b"dummy content", content_type="text/plain")
        data = {
            'title': 'Invalid File',
            'description': 'Test description',
            'genre': VIDEO_GENRES[0][0],
            'file_path': txt_file,
        }

        response = self.client.post(reverse('video_upload'), data, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertIn('file_path', response.data)

    def test_video_upload_file_too_large(self):
        big_file = SimpleUploadedFile("video.mp4", b"a" * (21 * 1024 * 1024), content_type="video/mp4")
        data = {
            'title': 'Too big',
            'description': 'Test description',
            'genre': VIDEO_GENRES[0][0],
            'file_path': big_file,
        }

        response = self.client.post(reverse('video_upload'), data, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertIn('file_path', response.data)
        self.assertIn('File size exceeds', str(response.data['file_path']))

    def test_video_upload_success(self):
        small_file = SimpleUploadedFile("video.mp4", b"dummy video content", content_type="video/mp4")
        data = {
            'title': 'Valid Upload',
            'description': 'A valid video upload test',
            'genre': VIDEO_GENRES[0][0],
            'file_path': small_file,
        }

        response = self.client.post(reverse('video_upload'), data, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertIn('title', response.data)