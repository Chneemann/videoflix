from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializer import LoginSerializer
from users.serializer import UserSerializer
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from users.models import CustomUser

class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, email=email, password=password)
            
            if user:
                if not user.is_active:
                    return Response({'password': 'Account is inactive, please check your mails'}, status=status.HTTP_403_FORBIDDEN)
                return self._create_token_response(user)
            return Response({'detail': 'Unable to login with provided credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
          
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _create_token_response(self, user):
        token = Token.objects.get_or_create(user=user)
        return Response({'token': token.key}, status=status.HTTP_200_OK)

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if CustomUser.objects.filter(email=email).exists():
            return Response({'detail': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        serialized = UserSerializer(data=request.data)
        if serialized.is_valid():
            user = serialized.save()  
            user.is_active = False
            user.set_password(password)
            user.save()
            self.send_email(user)
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_email(self, user):
        merge_data = {
            'name': user.username,
            'email': user.email,
            'token': user.verify_email
        }
        html_body = render_to_string("mail.html", merge_data)

        message = EmailMultiAlternatives(
            subject='Confirm your email',
            body=strip_tags(html_body),  # Plain text fallback
            from_email='noreply@videoflix.com',
            to=['andre.kempf.dev@gmail.com']
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)
        
class VerifyEmailView(APIView):
    def post(self, request):
        pass