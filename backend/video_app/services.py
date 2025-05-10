import os, uuid
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .models import Video

def validate_video_file(uploaded_file, max_size_mb=20):
    """
    Validate a video file
    """
    if not uploaded_file:
        return 'No file uploaded'
    if not uploaded_file.name.endswith('.mp4'):
        return 'Invalid file type. Only .mp4 files are allowed.'
    if uploaded_file.size > max_size_mb * 1024 * 1024:
        return f'File size exceeds the allowed limit of {max_size_mb}MB'
    return None

def save_video_file(uploaded_file):
    """
    Save an uploaded video file and return the short name and the file path.
    """
    short_name = uuid.uuid4().hex[:6]
    ext = os.path.splitext(uploaded_file.name)[1]
    new_filename = f"{short_name}{ext}"
    fs = FileSystemStorage(location=settings.VIDEO_DIR)
    fs.save(new_filename, uploaded_file)
    return short_name, os.path.join('videos', new_filename)

def create_video_record(data, user, short_name, file_path):
    """
    Creates a Video record in the database.
    """
    return Video.objects.create(
        title=data.get('title'),
        description=data.get('description'),
        genre=data.get('genre'),
        creator=user,
        file_name=short_name,
        file_path=file_path
    )