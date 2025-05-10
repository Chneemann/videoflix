from django.forms import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import VideoSerializer
from .models import Video
from .services import validate_video_file, save_video_file, create_video_record
from .class_assets import VIDEO_GENRES
from django.conf import settings
from django.http import JsonResponse
from django.db import transaction
import os

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def video_list(request):
    """
    List all videos with is_available=True
    """
    videos = Video.objects.filter(is_available=True)
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def genre_list(request):
    """
    Return a list of video genres from static choices.
    """
    genres = [{'code': code, 'name': name} for code, name in VIDEO_GENRES]
    return Response(genres)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_video_resolutions(request, id):
    """
    Check if a specific video exists in different resolutions (360p, 720p, 1080p).
    """
    resolutions = ['360p', '720p', '1080p']
    result = {}

    try:
        video = Video.objects.get(id=id)
    except Video.DoesNotExist:
        return JsonResponse({'error': 'Video not found'}, status=404)

    video_dir = os.path.join(settings.MEDIA_ROOT, 'videos', str(id))

    for res in resolutions:
        video_file_name = f"{video.file_name}_{res}.m3u8"
        video_file_path = os.path.join(video_dir, video_file_name)
        result[res] = os.path.exists(video_file_path)

    return JsonResponse(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def video_upload(request):
    """
    Handles the upload of a video file:
    """
    uploaded_file = request.FILES.get('file_path')
    
    error = validate_video_file(uploaded_file)
    if error:
        return Response({'error': error}, status=400)

    try:
        short_name, file_path = save_video_file(uploaded_file)
        with transaction.atomic():
            video = create_video_record(request.data, request.user, short_name, file_path)
        return Response(VideoSerializer(video).data, status=201)

    except ValidationError as ve:
        return Response({'error': f'Validation Error: {str(ve)}'}, status=400)
    except Exception as e:
        return Response({'error': f'Error while saving video file: {str(e)}'}, status=500)