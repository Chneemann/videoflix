from django.contrib import admin
from .models import CustomUser
from .forms import CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):    
  add_form = CustomUserCreationForm
  
  fieldsets = (
    *UserAdmin.fieldsets,
    (
      'Individual data',
      {
        'fields': (
          'verify_email',
          )
       }
     )
   )
  