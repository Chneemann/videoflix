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
from django.conf import settings
from django.conf.urls.static import static
from users import views as user_views
from auth.views import (
    LoginView,
    RegisterView,
    VerifyEmailView,
    AuthView,
    ForgotPasswordView,
    ChangePasswordView
)
from content import views as content_views
from debug_toolbar.toolbar import debug_toolbar_urls
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('django-rq/', include('django_rq.urls')),
    
    # Content URLs
    path('content/', content_views.video_list, name='video_list'),
    path('content/upload/', content_views.video_upload, name='video_upload'),
    path('content/movie/<int:id>/', content_views.check_video, name='check_video'),
 
    # Users URLs
    path('users/', user_views.user_list, name='user_list'),
    path('users/<int:id>/', user_views.user_detail, name='user_detail'),
    path('users/liked/<int:id>/', user_views.user_liked_detail, name='user_liked_detail'),

    # Authentication URLs
    path('auth/', AuthView.as_view(), name='auth_view'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + debug_toolbar_urls() + staticfiles_urlpatterns()