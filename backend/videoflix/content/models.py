from django.db import models
from django.conf import settings
from datetime import date
from .class_assets import FILM_GENRES
import os
class Video(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,default=1)
    created_at = models.DateField(default=date.today)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=500)
    film_genre = models.CharField(max_length=20, choices=FILM_GENRES, blank=True, null=True)
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)
    file_name = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'({self.id}) {self.title}'
    
    def save(self, *args, **kwargs):
        if self.video_file and not self.file_name:
            video_file_path = self.video_file.path
            base_filename, _ = os.path.splitext(os.path.basename(video_file_path))
            self.file_name = base_filename
        super().save(*args, **kwargs)
    