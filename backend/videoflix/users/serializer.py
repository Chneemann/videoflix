from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = CustomUser
    fields = ["id", "username", "email", "liked_videos"]
    

class LikedVideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['liked_videos']