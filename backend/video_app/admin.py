from django.contrib import admin
from .models import Video
from import_export import resources
from import_export.admin import ImportExportModelAdmin

class VideoResource(resources.ModelResource):
    class Meta:
        model = Video

@admin.register(Video)
class VideoAdmin(ImportExportModelAdmin):
    resource_class = VideoResource
    readonly_fields = ('file_name',)
    list_display = ('title', 'file_name', 'created_at') 