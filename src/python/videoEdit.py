from moviepy.video.io.VideoFileClip import VideoFileClip

input_video_path = 'src/videos/bigBuckBunny.mp4'
output_video_path = 'src/videos/trimmedVideo.mp4'

t1 = 3.22
t2 = 9.03

def trim_video(inPath, startTime, endTime, outPath):
    with VideoFileClip(inPath) as video:
        new = video.subclip(startTime, endTime)
        ## may need to change bitrate and/or codec if we change from mp4
        new.write_videofile(outPath, codec="libx264", audio_codec='aac', bitrate="6000k")

trim_video(input_video_path,t1,t2,output_video_path)