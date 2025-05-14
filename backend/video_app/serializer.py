from rest_framework import serializers
from video_app.class_assets import VIDEO_GENRES
from .models import Video, VideoProgress

class VideoSerializer(serializers.ModelSerializer):
  class Meta:
    model = Video
    fields = "__all__"

class VideoProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoProgress
        fields = ['id', 'user', 'video', 'position', 'updated_at']
        read_only_fields = ['id', 'user', 'updated_at']

class VideoUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['title', 'description', 'genre', 'file_path']

    file_path = serializers.FileField(write_only=True)
    genre = serializers.ChoiceField(choices=VIDEO_GENRES, required=True)
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=True)

    def validate_file_path(self, value):
        if not value.name.endswith('.mp4'):
            raise serializers.ValidationError("Invalid file type. Only .mp4 files are allowed.")
        if value.size > 20 * 1024 * 1024:
            raise serializers.ValidationError("File size exceeds the allowed limit of 20MB.")
        return value