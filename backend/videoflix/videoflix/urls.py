"""
URL configuration for videoflix project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users import views
from auth.views import LoginView, RegisterView, VerifyEmailView, AuthView, ForgotPasswordView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', views.user_list),
    path('users/<int:id>/', views.user_detail),
    path('auth/', AuthView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/register/', RegisterView.as_view()),
    path('auth/verify-email/', VerifyEmailView.as_view()),
    path('auth/forgot-password/', ForgotPasswordView.as_view()),
        
]
