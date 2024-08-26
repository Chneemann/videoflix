import string
import secrets
from django.contrib.auth.models import AbstractUser
from django.db import models
from content.models import Video

class CustomUser(AbstractUser):
    verify_email_token = models.CharField(max_length=20, blank=True, null=True)
    liked_videos = models.ManyToManyField(Video, blank=True)

    def save(self, *args, **kwargs):
        if not self.verify_email_token:
            self.verify_email_token = self.generate_verification_token()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_verification_token(length=20):
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))
