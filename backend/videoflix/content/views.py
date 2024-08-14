from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import VideoSerializer
from .models import Video
from django.core.cache.backends.base import DEFAULT_TIMEOUT 
from django.views.decorators.cache import cache_page 
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser

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
def check_thumbnail_status(request, video_id):
    """
    Check the status of the thumbnail creation for a specific video.
    """
    try:
        video = Video.objects.get(id=video_id)
        return Response({'thumbnail_created': video.thumbnail_created})
    except Video.DoesNotExist:
        return Response({'error': 'Video not found'}, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def video_upload(request):
    parser_classes = (MultiPartParser, FormParser)
    if request.method == 'POST':
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response({"error": "Invalid data", "details": serializer.errors}, status=400)