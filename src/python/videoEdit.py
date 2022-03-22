from moviepy.video.io.VideoFileClip import VideoFileClip

input_video_path = '../videos/bigBuckBunny.mp4'
output_video_path = "cutVid.mp4"

t1 = 3.22
t2 = 9.03

with VideoFileClip(input_video_path) as video:
    new = video.subclip(t1, t2)
    ## may need to change bitrate and/or codec if we change from mp4
    new.write_videofile(output_video_path, codec="libx264", audio_codec='aac', bitrate="6000k")