from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .models import CustomUser

@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    model = CustomUser

    list_display = ('username', 'email', 'last_login', 'date_joined', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('email', 'username')
    ordering = ('username',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Individual data',{'fields': ('favorite_videos', 'watched_videos', 'verify_email_token')})
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_active', 'is_staff'),
        }),
    )

    list_editable = ('is_active',)

admin.site.unregister(Group)