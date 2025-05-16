from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = CustomUser
    fields = ["id", "username", "email", "favorite_videos", "watched_videos"]
    

class FavoriteVideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['favorite_videos']
        
class WatchedVideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['watched_videos']