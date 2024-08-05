import secrets
import string
from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    verify_email = models.CharField(max_length=15, blank=True)

    def save(self, *args, **kwargs):
        if not self.verify_email:
            self.verify_email = self.generate_verification_token()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_verification_token(length=15):
        characters = string.ascii_letters + string.digits
        return ''.join(secrets.choice(characters) for _ in range(length))
