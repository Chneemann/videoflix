from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import UserSerializer
from .models import CustomUser

@api_view(['GET', 'POST'])
def user_list(request):
  
  if request.method == 'GET':
    user = CustomUser.objects.all()
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)

  elif request.method == 'POST':
    serializer = UserSerializer(data= request.data)
    if serializer.is_valid():
      serializer.save
      return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
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
        serializer().save()
        return Response(serializer.data)
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
      user.delete()
      return Response(status=status.HTTP_204_NO_CONTENT)