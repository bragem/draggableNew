import Draggable from "react-draggable";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import captureVideoFrame from "capture-video-frame";
import Myvideo from '../videos/antarcticbreeze_-_christmas_mood_ _unlimited_use_music_download (360p).mp4';
import ClickableDiv from 'react-clickable-div'
import useWindowSize from "../functions/useWindowSize";
const radius = 3;

export default function Editor() {
    let {windowHeight, windowWidth} = useWindowSize()

    let maxBound = 640 + radius;
    // let maxBound = windowWidth;
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
<<<<<<< HEAD
                <ClickableDiv id="containerBox" style={{ backgroundColor: "gray", backgroundImage: `url(${frameVid})`, backgroundSize: 120, width: maxBound }} onClick={(event) => {changeSeekerPos(event.pageX); graphsVideoRef.current.seekTo((event.pageX - 20)/maxBound);}} >
                    {/* The magic number in the seek to function is the margin in the first div in this return aka 20 */}
                    <div className="box" style={{backgroundColor: "rgba(255, 255, 255, 0.5)", border: 0, left: startRightBound + 25, height: 70, width: maxBound - startRightBound -6, margin: 0, padding: 0}} ></div>        
                    <div className="box" style={{backgroundColor: "rgba(255, 255, 255, 0.5)", border: 0, left: minBound + 20, height: 70, width: endLeftBound - minBound, margin: 0, padding: 0}} ></div>        
=======
            <ClickableDiv id="containerBox" style={{ backgroundColor: "gray", backgroundImage: `url(${frameVid})`, backgroundSize: 120, width: maxBound,  }} onClick={(event) => {changeSeekerPos(event.pageX); graphsVideoRef.current.seekTo((event.pageX - 20)/maxBound);}} >
                {/* The magic number in the seek to function is the margin in the first div in this return aka 20 */}
                <Draggable
                    axis="x"
                    onDrag={(e, data) => handleDrag(data, "start")}
                    onStart={() => hideSeeker()}
                    onStop={() => showSeeker()}
                    id="start"
                    defaultPosition={{ x: minBound, y: 0 }}
                    bounds={{ left: minBound, right: startRightBound }}
                >
                    <div className="box" style={{ width: 8, margin: 0, padding: 0, backgroundColor: '#D62E2E', border: 0, height: 70 }} />
                </Draggable>

                {showSeekerBool &&
>>>>>>> ae9319d4fe0d10274a4957ad45d44e7c6220685b
                    <Draggable
                        axis="x"
                        onDrag={(e, data) => handleDrag(data, "start")}
                        onStart={() => hideSeeker()}
                        onStop={() => showSeeker()}
                        id="start"
                        defaultPosition={{ x: minBound, y: 0 }}
                        bounds={{ left: minBound, right: startRightBound }}
                    >
<<<<<<< HEAD
                        <div className="box" style={{ width: 6, margin: 0, padding: 0, backgroundColor: 'red', border: 0, height: 70 }} />
=======
                        <div>
                            <div className="box" style={{ width: 66, margin: 0, left: -66 / 2, padding: 0, backgroundColor: "rgba(255, 255, 255, 0.6)", border: 0, height: 20 }} >
                                {timeFormat(playedSeconds)}
                            </div>
                            <div className="seeker" style={{ width: 4, margin: 0, padding: 0, backgroundColor: '#FFFFFF', border: 0, height: 70 }} />
                        </div>
>>>>>>> ae9319d4fe0d10274a4957ad45d44e7c6220685b
                    </Draggable>

<<<<<<< HEAD
                    {showSeekerBool &&
                        <Draggable
                            axis="x"
                            onDrag={(e, data) => handleDrag(data, "seeker")}
                            id="seeker"
                            defaultPosition={{ x: minBound, y: 0 }}
                            bounds={{ left: endLeftBound, right: startRightBound}}
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
                            bounds={{ left: endLeftBound, right: maxBound - 3}}
                        >
                            <div className="box" style={{ width: 6, margin: 0, padding: 0, backgroundColor: 'red', border: 0, height: 70 }} />
                        </Draggable>
                </ClickableDiv>
=======
                <Draggable
                    axis="x"
                    onDrag={(e, data) => handleDrag(data, "end")}
                    onStart={() => hideSeeker("end")}
                    onStop={(data) => showSeeker(data, "end")}
                    id="end"
                    defaultPosition={{ x: maxBound - 3, y: 0 }}
                    bounds={{ left: endLeftBound, right: maxBound - 3}}
                >
                    <div className="box" style={{ width: 8, margin: 0, padding: 0, backgroundColor: '#D62E2E', border: 0, height: 70 }} />
                </Draggable>
            </ClickableDiv>
>>>>>>> ae9319d4fe0d10274a4957ad45d44e7c6220685b
        </div >



    )
}


