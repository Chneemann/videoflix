from django.test import TestCase
from unittest.mock import patch, MagicMock
from .tasks import convert_video_to_hls, delete_original_video
from django.core.files.uploadedfile import SimpleUploadedFile


class VideoTasksTest(TestCase):
    @patch('subprocess.run')
    def test_convert_video_to_hls(self, mock_subprocess_run):
        """
        Tests whether the HLS conversion script is called correctly and the correct parameters are passed.
        """
        mock_subprocess_run.return_value = MagicMock()
        convert_video_to_hls('test/source.mp4', '1080', 1)
        mock_subprocess_run.assert_called_once()
        self.assertIn('-i', mock_subprocess_run.call_args[0][0])
        self.assertIn('hd1080', mock_subprocess_run.call_args[0][0])

    @patch('os.remove')
    def test_delete_original_video(self, mock_os_remove):
        """
        Checks whether the original video file is successfully deleted after conversion.
        """
        delete_original_video('test/source.mp4')
        mock_os_remove.assert_called_once_with('test/source.mp4')