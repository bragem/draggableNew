import Draggable from "react-draggable";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import captureVideoFrame from "capture-video-frame";
import Myvideo from '../videos/headervid.mp4';
const radius = 3;
// var ffmpeg = require('fluent-ffmpeg');
// var command = ffmpeg('./video.mp4');

export default function Editor() {
    let maxBound = 640 + radius;
    let minBound = 0;

    const [startRightBound, setStartBound] = useState(maxBound - radius * 2);
    const [endLeftBound, setEndBound] = useState(minBound + radius * 2);
    const graphsVideoRef = useRef(null);
    const [seekerPos, changeSeekerPos] = useState(maxBound - radius * 2);
    const [showSeekerBool, changeShowSeeker] = useState(true);
    const [videoPlaying, changeVideoPlaying] = useState(false);
    const [tmpSeekPos, changeTmpSeekPos] = useState(null);
    const [frameVid, setVidFrame] = useState(null);

    const [playedSeconds, updatePlayedSeconds] = useState(0);
    // const [endPos, changeEndPos] = useState(minBound + radius * 2);

    //TODO make div clcikable, so that the videoRef moves and drags to wherever the mouse clicks in the progressbar

    function handleDrag(data, name) {
        if (name === "start") {
            changeSeekerPos(data.x + radius * 2);
            graphsVideoRef.current.seekTo(data.x / maxBound);
            setEndBound(data.x + radius * 2);
            changeVideoPlaying(true);


        } else if (name === "end") {
            changeSeekerPos(data.x + radius * 2);
            graphsVideoRef.current.seekTo(data.x / maxBound);
            setStartBound(data.x - radius * 2);
            changeVideoPlaying(true);

        } else if (name === "seeker") {
            graphsVideoRef.current.seekTo(data.x / maxBound);
            changeSeekerPos(data.x / maxBound)
        }
        else if (name === "seeker") {
            let pos = data.x / maxBound
            changeSeekerPos(pos)
            graphsVideoRef.current.seekTo(pos);
            changeVideoPlaying(true);

        }


    }

    function hideSeeker(trimmer) {
        if (trimmer === "end") {
            changeTmpSeekPos(seekerPos);
        }
        changeShowSeeker(false)
    }

    function showSeeker(data, trimmer) {
        if (trimmer === "end") {
            // console.log("BBBBB");
            // console.log(tmpSeekPos)
            if (tmpSeekPos != null) {
                // console.log("tmp" + tmpSeekPos);
                if (data.x < tmpSeekPos) {
                    changeSeekerPos(startRightBound);
                    graphsVideoRef.current.seekTo(startRightBound / maxBound);
                    changeTmpSeekPos(null);
                } else {
                    changeSeekerPos(tmpSeekPos);
                    graphsVideoRef.current.seekTo(tmpSeekPos / maxBound);

                }

            }
        } else if (trimmer === "start") {
            changeSeekerPos(startRightBound);
            graphsVideoRef.current.seekTo(startRightBound / maxBound);
            changeTmpSeekPos(null);
        }
        changeShowSeeker(true)
    }

    function handleProgress(state) {
        let x = state.played * maxBound;
        // console.log(x);
        changeSeekerPos(x);
        if (x > startRightBound) {
            changeVideoPlaying(false);
        }


        updatePlayedSeconds(Math.floor(state.playedSeconds));
    }

    function timeFormat(seconds) {
        var convert = function (x) { return (x < 10) ? "0" + x : x; }
        return convert(parseInt(seconds / (60 * 60))) + ":" +
            convert(parseInt(seconds / 60 % 60)) + ":" +
            convert(seconds % 60)
    }

    // function edit(){
    //     command.setStartTime(10)
    //     command.duration(10)
    //     command.save('newVideo.mp4')
    // }
    // edit();

    //lagrer posisjonene relativt i forhold til lengden av diven og legger
    // det til som metadata på videoen når man er ferdig å redigere

    // const saveVideo = () => {
    //     var metadata = {
    //         "trim_times": this.state.timings,
    //         "mute": this.state.isMuted
    //     }
    //     this.props.saveVideo(metadata)
    // }

    function generateFrame() {
        // console.log(graphsVideoRef.current.getInternalPlayer());
        changeVideoPlaying(true);
        const frame = captureVideoFrame(graphsVideoRef.current.getInternalPlayer());

        setVidFrame(frame.dataUri);


    }


    useEffect(() => {
        generateFrame();
    }, []);

    return (
        <div style={{ margin: 20 }}>


            <ReactPlayer
                ref={graphsVideoRef}
                url={Myvideo}
                controls={true}
                onProgress={(state) => handleProgress(state)}
                progressInterval={50}
                playing={videoPlaying}
                onPlay={() => changeVideoPlaying(true)}

            />
            <div id="containerBox" style={{ backgroundColor: "gray", backgroundImage: `url(${frameVid})`, backgroundSize: 120, width: maxBound }}>
                <Draggable
                    axis="x"
                    onDrag={(e, data) => handleDrag(data, "start")}
                    onStart={() => hideSeeker()}
                    onStop={() => showSeeker()}
                    id="start"
                    defaultPosition={{ x: minBound, y: 0 }}
                    bounds={{ left: minBound, right: startRightBound }}
                >
                    <div className="box" style={{ width: 6, margin: 0, padding: 0, backgroundColor: 'red', border: 0, height: 70 }} />
                </Draggable>

                {showSeekerBool &&
                    <Draggable
                        axis="x"
                        onDrag={(e, data) => handleDrag(data, "seeker")}
                        id="seeker"
                        defaultPosition={{ x: minBound, y: 0 }}
                        bounds={{ left: endLeftBound + 10, right: startRightBound - 3 }}
                        position={{ x: seekerPos, y: 0 }}
                    >
                        <div>
                            <div className="box" style={{ width: 66, margin: 0, left: -66 / 2, padding: 0, backgroundColor: "rgba(255, 255, 255, 0.6)", border: 0, height: 20 }} >
                                {timeFormat(playedSeconds)}
                            </div>
                            <div className="seeker" style={{ width: 3, margin: 0, padding: 0, backgroundColor: 'white', border: 0, height: 70 }} />
                        </div>
                    </Draggable>
                }

                <Draggable
                    axis="x"
                    onDrag={(e, data) => handleDrag(data, "end")}
                    onStart={() => hideSeeker("end")}
                    onStop={(data) => showSeeker(data, "end")}
                    id="end"
                    defaultPosition={{ x: maxBound - 3, y: 0 }}
                    bounds={{ left: endLeftBound, right: maxBound - 3 }}
                >
                    <div className="box" style={{ width: 6, margin: 0, padding: 0, backgroundColor: 'red', border: 0, height: 70 }} />
                </Draggable>
            </div>
        </div >



    )
}


