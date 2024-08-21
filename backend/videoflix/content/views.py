from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import VideoSerializer
from .models import Video
from django.core.cache.backends.base import DEFAULT_TIMEOUT 
from django.views.decorators.cache import cache_page 
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
import os

CACHETTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
#@cache_page(CACHETTL)
def video_list(request):
    """
    List all videos.
    """
    videos = Video.objects.all()
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_video(request, id):
    """
    Check if a specific video exists in different resolutions (480p, 720p, 1080p).
    """
    resolutions = ['480', '720', '1080']
    result = {}

    try:
        video = Video.objects.get(id=id)
    except Video.DoesNotExist:
        return JsonResponse({'error': 'Video not found'}, status=404)

    video_dir = os.path.join(settings.MEDIA_ROOT, 'videos', str(id))

    for res in resolutions:
        video_file_name = f"{video.file_name}_{res}p.m3u8"
        video_file_path = os.path.join(video_dir, video_file_name)
        result[res] = os.path.exists(video_file_path)

    return JsonResponse(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def video_upload(request):
    """
    Handle the upload of a video file.
    """
    parser_classes = (MultiPartParser, FormParser)
    if request.method == 'POST':
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=400)