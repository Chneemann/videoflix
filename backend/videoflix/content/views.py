from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializer import VideoSerializer
from .models import Video

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def video_list(request):
  
  if request.method == 'GET':
    video = Video.objects.all()
    serializer = VideoSerializer(video, many=True)
    return Response(serializer.data)