from django.db import models
from django.conf import settings
from datetime import date
from .class_assets import VIDEO_GENRES
import os

class Video(models.Model):
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,default=1)
    created_at = models.DateField(default=date.today)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=500)
    genre = models.CharField(max_length=20, choices=VIDEO_GENRES, blank=True, null=True)
    file_path = models.FileField(upload_to='videos/', blank=True, null=True)
    file_name = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'({self.id}) {self.title}'
    
    def save(self, *args, **kwargs):
        if self.file_path and not self.file_name:
            file_path = self.file_path.path
            base_filename, _ = os.path.splitext(os.path.basename(file_path))
            self.file_name = base_filename
        super().save(*args, **kwargs)
    