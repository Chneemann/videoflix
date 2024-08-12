from .models import Video
from content.tasks import convert_video, create_thumbnails
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from django.conf import settings
import os
import django_rq

@receiver(post_save, sender=Video)
def video_post_save(sender, instance, created, **kwargs):
    """
    Generates a thumbnail for a newly created `Video` instance.
    """
    if created:
        queue = django_rq.get_queue("default", autocommit=True)
        
        #Convert Video
        queue.enqueue(convert_video, instance.video_file.path, "480")
        queue.enqueue(convert_video, instance.video_file.path, "720")
        queue.enqueue(convert_video, instance.video_file.path, "1080")
        
        #Create Thumbnail
        queue.enqueue(create_thumbnails, instance)

@receiver(post_delete, sender=Video)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes video file and its converted files from filesystem
    when corresponding `Video` object is deleted.
    """
    # Delete the original video file
    if instance.video_file:
        if os.path.isfile(instance.video_file.path):
            os.remove(instance.video_file.path)
    
    # Delete the converted videos
    if instance.video_file:
        delete_converted_files(instance.video_file.path)

    # Delete the thumbnails
    if instance.thumbnail:
        thumbnail_dir = settings.THUMBNAIL_DIR
        base_filename = os.path.splitext(os.path.basename(instance.video_file.path))[0]
        thumbnail_1080p_path = os.path.join(thumbnail_dir, base_filename + '_1080p.jpg')
        thumbnail_480_path = os.path.join(thumbnail_dir, base_filename + '_480p.jpg')

        if os.path.isfile(thumbnail_1080p_path):
            os.remove(thumbnail_1080p_path)
        if os.path.isfile(thumbnail_480_path):
            os.remove(thumbnail_480_path)

def remove_first_mp4(filename):
    """
    Remove the first .mp4 extension from the filename.
    """
    name_part, ext_part = filename.split('.mp4', 1)
    new_filename = name_part + ext_part
    return new_filename

def delete_converted_files(video_file_path):
    """
    Delete all converted video files related to the original video file.
    """
    resolutions = ["480", "720", "1080"]
    for resolution in resolutions:
        converted_video_path = video_file_path + f'_{resolution}p.mp4'
        converted_video_path = remove_first_mp4(converted_video_path)
        if os.path.isfile(converted_video_path):
            os.remove(converted_video_path)
