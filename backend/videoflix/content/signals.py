from .models import Video
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_save, post_delete
import ffmpeg
import os

@receiver(post_save, sender=Video)
def video_post_save(sender, instance, created, **kwargs):
    """
    Generates a thumbnail for a newly created `Video` instance.
    """
    if created:
        video_file_path = instance.video_file.path
        thumbnail_dir = settings.THUMBNAIL_DIR
        
        thumbnail_filename = os.path.splitext(os.path.basename(video_file_path))[0] + '.jpg'
        thumbnail_path = os.path.join(thumbnail_dir, thumbnail_filename)
        absolute_thumbnail_path = os.path.abspath(thumbnail_path)

        if not os.path.exists(thumbnail_dir):
            os.makedirs(thumbnail_dir)

        try:
            ffmpeg.input(video_file_path, ss=1).output(absolute_thumbnail_path, vframes=1).run(overwrite_output=True)
            instance.thumbnail = os.path.relpath(thumbnail_path, start=settings.MEDIA_ROOT)
            instance.save()

            print("New video and thumbnail generated")
        except ffmpeg._run.Error as e:
            print(f"An error occurred: {e.stderr.decode()}")
            
@receiver(post_delete, sender=Video)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `Video` object is deleted.
    """
    if instance.video_file:
        if os.path.isfile(instance.video_file.path):
            os.remove(instance.video_file.path)