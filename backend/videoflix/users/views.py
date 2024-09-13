from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import LikedVideosSerializer, WatchedVideosSerializer, UserSerializer
from .models import CustomUser

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_list(request):
  
  if request.method == 'GET':
    user = CustomUser.objects.all()
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)

  elif request.method == 'POST':
    serializer = UserSerializer(data= request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail(request, id):
  
    try:
      user = CustomUser.objects.get(pk=id)
    except CustomUser.DoesNotExist:
      return Response(status=status.HTTP_404_NOT_FOUND)
  
    if request.method == 'GET':
      serializer = UserSerializer(user)
      return Response(serializer.data)
    
    elif request.method == 'PUT':
      serializer = UserSerializer(user, data=request.data)
      if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
      user.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def user_liked_detail(request, id):
    try:
        user = CustomUser.objects.get(pk=id)
    except CustomUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = LikedVideosSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
def user_watched_detail(request, id):
    try:
        user = CustomUser.objects.get(pk=id)
    except CustomUser.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = WatchedVideosSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)