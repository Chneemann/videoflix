from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    custom = models.CharField(max_length=1000, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.CharField(max_length=150, blank=True)