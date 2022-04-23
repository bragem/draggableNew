import Draggable from "react-draggable";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import captureVideoFrame from "capture-video-frame";
import Myvideo from '../videos/bigBuckBunny.mp4';
import ClickableDiv from 'react-clickable-div'
import { BiArrowBack } from 'react-icons/bi'
import { GiPauseButton, GiPlayButton } from 'react-icons/gi'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'
// import DashedLine from "react-native-dashed-line";

const radius = 4;

//TODO hele komponenten må være responsiv og pen på mobil, er kun det det skal lages til, ikke web.


export default function Editor2() {
    let minBound = 0;

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [maxBound, setMaxBound] = useState(width - radius);

    const [startRightBound, setStartBound] = useState(maxBound - radius);
    const [endLeftBound, setEndBound] = useState(0);
    const graphsVideoRef = useRef(null);
    const [seekerPos, changeSeekerPos] = useState(0);
    const [videoPlaying, changeVideoPlaying] = useState(false);
    const [tmpSeekPos, changeTmpSeekPos] = useState(null);
    const [frameVid, setVidFrame] = useState(null);
    const [rightEnd, setRightEnd] = useState(width)

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
            changeSeekerPos(data.x);
            graphsVideoRef.current.seekTo(seekerPos / maxBound);
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
        var length = graphsVideoRef.current.getDuration()
        var right = length * (1 - (maxBound - startRightBound) / maxBound)
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

        if (state.playedSeconds == right) {
            changeSeekerPos(startRightBound)
            graphsVideoRef.current.seekTo(endLeftBound / maxBound)
            changeVideoPlaying(true)
        }

        updatePlayedSeconds(Math.floor(state.playedSeconds));
    }

    function timeFormat(seconds) {
        var convert = function (x) { return (x < 10) ? "0" + x : x; }
        return convert(parseInt(seconds / (60 * 60))) + ":" +
            convert(parseInt(seconds / 60 % 60)) + ":" +
            convert(seconds % 60)
    }


    // function generateFrame() {
    //     changeVideoPlaying(true);
    //     const frame = captureVideoFrame(graphsVideoRef.current.getInternalPlayer());
    //     setVidFrame(frame.dataUri);
    // }

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
        console.log(cliptime())
        // Go to the next screen
    }

    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        // generateFrame();
        // console.log(width, height)
        console.log(maxBound, startRightBound, endLeftBound, seekerPos)
        setMaxBound(width - radius * 2)
        setEndBound(radius * 2)
        changeSeekerPos(minBound)
        console.log(maxBound, startRightBound, endLeftBound, seekerPos)
        console.log(rightEnd)
    }, []);
    return (
        <div>
            <div style={{ margin: 0, width: '100%', height: height - 120, alignContent: "center", backgroundColor: '#000', maxHeight: height, maxWidth: width }
            }>

                <ReactPlayer
                    ref={graphsVideoRef}
                    url={Myvideo}
                    controls={true}
                    progressInterval={0}
                    onProgress={(state) => handleProgress(state)}

                    playing={videoPlaying}
                    onPlay={() => changeVideoPlaying(true)}
                    width={'100%'}
                    height={'100%'}
                />
            </div>
            <div>
                // alskdjalskdj
            </div>
            <div style={{ display: 'flex', position: "absolute", bottom: 0, width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
                <div className="" onClick={back} style={{ padding: 10, marginLeft: 20, marginRight: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: 15 }}><BiArrowBack size={18} style={{ marginRight: 5 }} />  Back</div>
                <div className="" onClick={pause} style={{ height: 'auto' }}> {videoPlaying
                    ? <GiPauseButton size={20} style={{ height: 'auto' }} />
                    : <GiPlayButton size={20} style={{ height: 'auto' }} />}</div>
                <div onClick={next} style={{ backgroundColor: "#131312", color: "#FFFFFF", padding: 10, borderRadius: 25, marginRight: 20, marginLeft: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 13, paddingRight: 13, fontSize: 15 }}>Next <BiArrowBack size={18} style={{ transform: 'scaleX(-1)', marginLeft: 5 }} /></div>
            </div >

        </div>
    )
}
