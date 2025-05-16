from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.generic import RedirectView
from user_app import views as user_views
from auth_app.views import (
    LoginView,
    LogoutView,
    RegisterView,
    VerifyEmailView,
    AuthView,
    ForgotPasswordView,
    ChangePasswordView
)
from video_app import views as video_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('django-rq/', include('django_rq.urls')),
    
    # Content URLs
    path('videos/', video_views.video_list, name='video_list'),
    path('video/upload/', video_views.video_upload, name='video_upload'),
    path('video/genres/', video_views.genre_list, name='genre_list'),
    path('video/<int:id>/', video_views.check_video_resolutions, name='check_video_resolutions'),
    path('video/progress/<int:video_id>', video_views.video_progress_view, name='video-progress'),   
    
    # Users URLs
    path('users/', user_views.users_list, name='users_list'),
    path('users/<int:id>/video-prefs/', user_views.user_video_preferences, name='user_video_preferences'),
    path('users/<int:id>/favorites/', user_views.user_favorite_videos, name='user_favorite_videos'),
    path('users/<int:id>/watched/', user_views.user_watched_videos, name='user_watched_videos'),
    
    # Authentication URLs
    path('auth/', AuthView.as_view(), name='auth_view'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change_password'),

    path("favicon.ico", RedirectView.as_view(url="/static/favicon.ico")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

urlpatterns += staticfiles_urlpatterns()