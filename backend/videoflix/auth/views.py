from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializer import LoginSerializer

class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            
            if user:
                return self._create_token_response(user)
            return Response({'detail': 'Unable to login with provided credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
          
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _create_token_response(self, user):
        token, created = Token.objects.get_or_create(user=user)
        return Response({token.key}, status=status.HTTP_200_OK)