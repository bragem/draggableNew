import Draggable from "react-draggable";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import captureVideoFrame from "capture-video-frame";
import Myvideo from '../videos/bigBuckBunny.mp4';
import ClickableDiv from 'react-clickable-div'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
const radius = 4;

//TODO hele komponenten må være responsiv og pen på mobil, er kun det det skal lages til, ikke web.


export default function Editor() {
    // let maxBound = 640 + radius;
    let minBound = 0;


    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [maxBound, setMaxBound] = useState(width - radius);

    const [startRightBound, setStartBound] = useState(0);
    const [endLeftBound, setEndBound] = useState(0);
    const graphsVideoRef = useRef(null);
    const [seekerPos, changeSeekerPos] = useState(0);
    const [videoPlaying, changeVideoPlaying] = useState(false);
    const [tmpSeekPos, changeTmpSeekPos] = useState(null);
    const [frameVid, setVidFrame] = useState(null);

    const [playedSeconds, updatePlayedSeconds] = useState(0);



    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

    }

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
    }

    function showSeeker(data, trimmer) {
        if (trimmer === "end") {
            if (tmpSeekPos != null) {
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
    }

    function handleProgress(state) {
        let x = state.played * maxBound;
        changeSeekerPos(x);
        if (x > startRightBound) {
            changeVideoPlaying(false);
            changeSeekerPos(startRightBound)
            graphsVideoRef.current.seekTo(startRightBound / maxBound)

        }
        else if (x < endLeftBound) {
            changeSeekerPos(endLeftBound)
            graphsVideoRef.current.seekTo(endLeftBound / maxBound)
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
        changeVideoPlaying(true);
        const frame = captureVideoFrame(graphsVideoRef.current.getInternalPlayer());

        setVidFrame(frame.dataUri);
    }

    function cliptime() {
        // onClick the next next-button, this function is called
        var length = graphsVideoRef.current.getDuration()
        var left = length * (endLeftBound - minBound) / maxBound
        var right = length * (1 - (maxBound - startRightBound) / maxBound)
        return [left, right]
    }

    function back() {
        console.log("back")
        // Cancel analysis
    }

    function pause() {
        console.log("pause")
        changeVideoPlaying(!videoPlaying)
    }

    function next() {
        console.log("next")
        console.log(cliptime)
        // Go to the next screen
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        generateFrame();
        // console.log(width, height)
        setMaxBound(width - radius)
        setStartBound(maxBound - radius)
        setEndBound(0)
        changeSeekerPos(maxBound - radius)
        console.log(maxBound)
    }, []);

    return (
        <div id="container" className="flex flex-col h-full overflow-hidden">
            <div style={{ margin: 0, width: '100%', height: height - 120, alignContent: "center", backgroundColor: '#000' }
            }>

                <ReactPlayer
                    ref={graphsVideoRef}
                    url={Myvideo}
                    controls={true}
                    onProgress={(state) => handleProgress(state)}
                    progressInterval={50}
                    playing={videoPlaying}
                    onPlay={() => changeVideoPlaying(true)}
                    width={'100%'}
                    height={'100%'}
                />
                <ClickableDiv className="md:w-32" id="containerBox" style={{ position: 'relative', backgroundColor: "gray", backgroundImage: `url(${frameVid})`, backgroundSize: 120, width: maxBound, }} onClick={(event) => { changeSeekerPos(event.pageX); graphsVideoRef.current.seekTo((event.pageX - 20) / maxBound); }} >
                    {/* The magic number in the seek to function is the margin in the first div in this return aka 20 */}
                    <Draggable
                        axis="x"
                        onDrag={(e, data) => handleDrag(data, "seeker")}
                        id="seeker"
                        defaultPosition={{ x: minBound, y: 0 }}
                        bounds={{ left: endLeftBound, right: startRightBound }}
                        position={{ x: seekerPos, y: 0 }}
                    >
                        <div>
                            <div className="box" style={{ width: 66, margin: 0, position: 'absolute', left: -66 / 2, padding: 0, backgroundColor: "rgba(185, 185, 185, 0.85)", border: 0, height: 20 }} >
                                {timeFormat(playedSeconds)}
                            </div>
                            <div className="seeker" style={{ width: 3, margin: 0, padding: 0, backgroundColor: '#FFFFFF', border: 0, height: 70 }} />
                        </div>
                    </Draggable>

                    <div style={{ marginTop: -70 }}>
                        {/* Left bound */}
                        <div className="boxL" style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", border: 0, left: minBound, height: 70, width: endLeftBound - minBound, margin: 0, padding: 0 }} ></div>

                        {/* Right bound */}
                        <div className="boxR" style={{ backgroundColor: "rgba(255, 255, 255, 0.7)", border: 0, left: startRightBound + 6, height: 70, width: maxBound - startRightBound, margin: 0, padding: 0 }} ></div>

                        <Draggable
                            axis="x"
                            onDrag={(e, data) => handleDrag(data, "start")}
                            onStart={() => hideSeeker()}
                            onStop={() => showSeeker()}
                            id="start"
                            defaultPosition={{ x: minBound, y: 0 }}
                            bounds={{ left: minBound, right: startRightBound }}
                        >
                            <div className="boxL rounded-l-lg" style={{ width: 8, margin: 0, padding: 0, backgroundColor: '#D62E2E', border: 0, height: 70, }} ><ArrowBackIosIcon style={{ maxWidth: 8, color: 'white' }} /></div>
                        </Draggable>
                        <Draggable
                            axis="x"
                            onDrag={(e, data) => handleDrag(data, "end")}
                            onStart={() => hideSeeker("end")}
                            id="end"
                            defaultPosition={{ x: maxBound - 3, y: 0 }}
                            bounds={{ left: endLeftBound, right: maxBound - 3 }}
                        >
                            <div className="boxR rounded-r-lg" style={{ width: 8, margin: 0, padding: 0, backgroundColor: '#D62E2E', border: 0, height: 70 }} />
                        </Draggable>
                    </div>
                </ClickableDiv>

            </div >
            <div style={{ display: 'flex', position: "absolute", bottom: 0, width: '100%', justifyContent: 'space-between' }}>
                <button onClick={back}>back</button>
                <button onClick={pause}>pause</button>
                <button onClick={next}>Next</button>
            </div>
        </div>
    )
}


