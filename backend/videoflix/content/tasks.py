import subprocess
import ffmpeg
import os
from django.conf import settings

def convert_video(source, resolution):
    target = source + f'_{resolution}p.mp4'
    target = remove_first_mp4(target)
    ffmpeg_path = '/opt/homebrew/bin/ffmpeg'
    cmd = [ffmpeg_path, '-i', source, '-s', f'hd{resolution}', '-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', '-strict', '-2', target]
    result = subprocess.run(cmd, capture_output=True, text=True)
    
def remove_first_mp4(filename):
    name_part, ext_part = filename.split('.mp4', 1)
    new_filename = name_part + ext_part
    return new_filename
  
def create_thumbnail(source):
    video_file_path = source.video_file.path
    thumbnail_dir = settings.THUMBNAIL_DIR

    base_filename = os.path.splitext(os.path.basename(video_file_path))[0]
    thumbnail_1920_filename = base_filename + '_1920p.jpg'
    thumbnail_1920_path = os.path.join(thumbnail_dir, thumbnail_1920_filename)
    thumbnail_480_filename = base_filename + '_480p.jpg'
    thumbnail_480_path = os.path.join(thumbnail_dir, thumbnail_480_filename)

    if not os.path.exists(thumbnail_dir):
        os.makedirs(thumbnail_dir)

    try:
        ffmpeg.input(video_file_path, ss=1).output(thumbnail_1920_path, vf='scale=1920:-1', vframes=1).run(overwrite_output=True)
        ffmpeg.input(video_file_path, ss=1).output(thumbnail_480_path, vf='scale=480:-1', vframes=1).run(overwrite_output=True)

        source.thumbnail_1920 = os.path.relpath(thumbnail_1920_path, start=settings.MEDIA_ROOT)
        source.thumbnail_480 = os.path.relpath(thumbnail_480_path, start=settings.MEDIA_ROOT)

        source.save()

    except ffmpeg._run.Error as e:
        print(f"Ein Fehler ist aufgetreten: {e.stderr.decode()}")