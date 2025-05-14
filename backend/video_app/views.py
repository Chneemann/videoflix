from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import VideoProgressSerializer, VideoSerializer, VideoUploadSerializer
from .models import Video, VideoProgress
from .services import save_video_file, create_video_record
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

    return Response(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def video_upload(request):
    """
    Handles the upload of a video file:
    """
    serializer = VideoUploadSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    uploaded_file = serializer.validated_data['file_path']
    short_name, file_path = save_video_file(uploaded_file)

    try:
        with transaction.atomic():
            video = create_video_record(serializer.validated_data, request.user, short_name, file_path)
        return Response(VideoSerializer(video).data, status=201)
    except Exception as e:
        return Response({'error': f'Error while saving video: {str(e)}'}, status=500)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def video_progress_view(request, video_id):
    """
    GET: Get last watched position of a video for the current user.
    POST: Update the current watching position for the user.
    """
    video = get_object_or_404(Video, id=video_id)

    if request.method == 'GET':
        try:
            progress = VideoProgress.objects.get(user=request.user, video=video)
            serializer = VideoProgressSerializer(progress)
            return Response(serializer.data)
        except VideoProgress.DoesNotExist:
            return Response({'position': 0.0})

    elif request.method == 'POST':
        position = request.data.get('position')
        if position is None:
            return Response({'error': 'No position provided'}, status=400)

        progress, _ = VideoProgress.objects.update_or_create(
            user=request.user,
            video=video,
            defaults={'position': position}
        )
        serializer = VideoProgressSerializer(progress)
        return Response(serializer.data)