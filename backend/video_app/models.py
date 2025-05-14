from django.db import models
from django.conf import settings
from datetime import date
from .class_assets import VIDEO_GENRES

class Video(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,default=1)
    created_at = models.DateField(default=date.today)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=500)
    genre = models.CharField(max_length=20, choices=VIDEO_GENRES, blank=True, null=True)
    file_path = models.FileField(upload_to='videos/', blank=True, null=True)
    file_name = models.CharField(max_length=50, blank=True, null=True)
    is_available = models.BooleanField(default=False)

    def __str__(self):
        return f'({self.id}) {self.title}'


class VideoProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='video_progress'
    )
    video = models.ForeignKey(
        'Video',
        on_delete=models.CASCADE,
        related_name='progress_entries'
    )
    position = models.FloatField(default=0.0) 
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'video')
        ordering = ['-updated_at']

    def __str__(self):
        return f'{self.user} - {self.video} @ {round(self.position, 1)}s'