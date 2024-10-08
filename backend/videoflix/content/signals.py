from .models import Video
from .tasks import convert_video_to_hls, create_thumbnails, delete_original_video
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
import os
import django_rq
import shutil

@receiver(post_save, sender=Video)
def video_post_save(sender, instance, created, **kwargs):
    """
    Generates a thumbnail, enqueues tasks to convert the video to different resolutions, and schedules the deletion of the original video file.
    """
    if created:
        queue = django_rq.get_queue("default", autocommit=True)
        
        #Create thumbnail
        create_thumbnails(instance, instance.id)
        
        #Convert video
        for resolution in ["1280x720", "640x360", "1920x1080"]:
            queue.enqueue(convert_video_to_hls, instance.video_file.path, resolution, instance.id)
            
        #Delete the original video file
        queue.enqueue(delete_original_video, instance.video_file.path)
        
@receiver(post_delete, sender=Video)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes the video and all converted files from the file system,
    when the corresponding `Video` object is deleted.
    """
    main_directory = os.path.dirname(instance.video_file.path)
    parent_directory = os.path.dirname(main_directory)
    model_directory = os.path.join(main_directory, str(instance.id))
    thumbnail_directory = os.path.join(parent_directory, 'thumbnails', str(instance.id))

    delete_directory(model_directory)
    delete_directory(thumbnail_directory)

def delete_directory(directory_path):
    """
    Deletes the specified directory recursively.
    """
    if os.path.exists(directory_path):
        shutil.rmtree(directory_path)
    else:
        print(f"Folder not found: {directory_path}")
        
def delete_converted_files(video_file_path):
    """
    Delete all converted video files related to the original video file.
    """
    resolutions = ["360", "720", "1080"]
    for resolution in resolutions:
        converted_video_path = video_file_path + f'_{resolution}p.mp4'
        converted_video_path = remove_first_mp4(converted_video_path)
        if os.path.isfile(converted_video_path):
            os.remove(converted_video_path)

def remove_first_mp4(filename):
    """
    Remove the first .mp4 extension from the filename.
    """
    name_part, ext_part = filename.split('.mp4', 1)
    new_filename = name_part + ext_part
    return new_filename
