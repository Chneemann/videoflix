import shutil
import subprocess
import ffmpeg
import os
from django.conf import settings

def convert_video_to_hls(source, resolution, model_id):
    """
    Converts a video to the HLS format
    """
    resolution_after_x = resolution.split('x')[1] if 'x' in resolution else resolution

    target_dir = os.path.join(os.path.dirname(source), str(model_id))
    os.makedirs(target_dir, exist_ok=True)

    base_filename = os.path.basename(source).split(".")[0]
    target = os.path.join(target_dir, f'{base_filename}_{resolution_after_x}p')
    
    ffmpeg_path = shutil.which("ffmpeg")
    cmd = [
        ffmpeg_path, 
        '-i', source, 
        '-s', resolution, 
        '-c:v', 'libx264', 
        '-crf', '23', 
        '-c:a', 'aac', 
        '-strict', '-2', 
        '-hls_time', '10',
        '-hls_playlist_type', 'vod', 
        '-hls_segment_filename', os.path.join(target_dir, f'{base_filename}_{resolution_after_x}p_%03d.ts'),
        f'{target}.m3u8'
    ]
    
    subprocess.run(cmd, capture_output=True, text=True)

def delete_original_video(source):
    """
     Deletes the original MP4 file.
    """
    try:
        os.remove(source)
    except OSError as e:
        print(f"Error deleting original file: {e}")

def create_thumbnails(instance, model_id):
    """
    Creates high-resolution and low-resolution thumbnails from a video file.
    """
    video_file_path = instance.video_file.path
    thumbnail_dir = os.path.join(settings.THUMBNAIL_DIR, str(model_id))

    base_filename = os.path.splitext(os.path.basename(video_file_path))[0]
    thumbnail_1080p_filename = base_filename + '_1080p.jpg'
    thumbnail_1080p_path = os.path.join(thumbnail_dir, thumbnail_1080p_filename)
    thumbnail_480_filename = base_filename + '_480p.jpg'
    thumbnail_480_path = os.path.join(thumbnail_dir, thumbnail_480_filename)

    if not os.path.exists(thumbnail_dir):
        os.makedirs(thumbnail_dir)

    try:
        # Generate the image thumbnails
        ffmpeg.input(video_file_path, ss=1).output(thumbnail_1080p_path, vf='scale=1920:-1', vframes=1).run(overwrite_output=True)
        ffmpeg.input(video_file_path, ss=1).output(thumbnail_480_path, vf='scale=720:-1', vframes=1).run(overwrite_output=True)
        
        # Create the 10-second video thumbnail
        create_video_thumbnail(video_file_path, thumbnail_dir, base_filename)

    except ffmpeg._run.Error as e:
        error_message = e.stderr.decode() if e.stderr else "Unknown ffmpeg error"
        print(f"An error has occurred: {error_message}")

def create_video_thumbnail(video_file_path, thumbnail_dir, base_filename):
    """
    Creates a 10-second video thumbnail from a video file without audio.
    """
    video_thumbnail_filename = base_filename + '_video-thumbnail.mp4'
    video_thumbnail_path = os.path.join(thumbnail_dir, video_thumbnail_filename)

    try:
        ffmpeg.input(video_file_path, ss=1, t=10).output(
            video_thumbnail_path, 
            vf='scale=1280:-1', 
            vcodec='libx264', 
            an=None  # Disable audio
        ).run(overwrite_output=True)

    except ffmpeg._run.Error as e:
        error_message = e.stderr.decode() if e.stderr else "Unknown ffmpeg error"
        print(f"An error has occurred: {error_message}")