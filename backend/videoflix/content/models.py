from django.db import models
from datetime import date
from .class_assets import FILM_GENRES

class Video(models.Model):
    created_at = models.DateField(default=date.today)
    title = models.CharField(max_length=80)
    description = models.CharField(max_length=500)
    film_genre = models.CharField(max_length=20, choices=FILM_GENRES, blank=True, null=True)
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    
    def __str__(self):
        return self.title