from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import VideoSerializer
from .models import Video
from django.core.cache.backends.base import DEFAULT_TIMEOUT 
from django.views.decorators.cache import cache_page 
from django.conf import settings

CACHETTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@cache_page(CACHETTL)
def video_list(request):
  
  if request.method == 'GET':
    video = Video.objects.all()
    serializer = VideoSerializer(video, many=True)
    return Response(serializer.data)