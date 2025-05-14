from django.contrib import admin
from .models import Video, VideoProgress
from import_export import resources
from import_export.admin import ImportExportModelAdmin

class VideoResource(resources.ModelResource):
    class Meta:
        model = Video

class VideoProgressInline(admin.TabularInline):
    model = VideoProgress
    extra = 0
    readonly_fields = ('user', 'position', 'updated_at')
    can_delete = False

@admin.register(Video)
class VideoAdmin(ImportExportModelAdmin):
    resource_class = VideoResource
    readonly_fields = ('file_path',)
    list_display = ('title', 'file_path', 'genre', 'created_at', 'is_available')
    list_display_links = ('title',)
    list_filter = ('is_available', 'genre', 'created_at')
    search_fields = ('title', 'description')
    inlines = [VideoProgressInline]