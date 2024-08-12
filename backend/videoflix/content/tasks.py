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
        
    thumbnail_filename = os.path.splitext(os.path.basename(video_file_path))[0] + '.jpg'
    thumbnail_path = os.path.join(thumbnail_dir, thumbnail_filename)
    absolute_thumbnail_path = os.path.abspath(thumbnail_path)

    if not os.path.exists(thumbnail_dir):
        os.makedirs(thumbnail_dir)

    try:
        ffmpeg.input(video_file_path, ss=1).output(absolute_thumbnail_path, vf='scale=300:-1', vframes=1).run(overwrite_output=True)
        source.thumbnail = os.path.relpath(thumbnail_path, start=settings.MEDIA_ROOT)
        source.save()

        print("New video and thumbnail generated")
    except ffmpeg._run.Error as e:
        print(f"An error occurred: {e.stderr.decode()}")