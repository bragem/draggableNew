import Draggable from "react-draggable";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Myvideo from '../videos/bigBuckBunny.mp4';
import ClickableDiv from 'react-clickable-div'
import { BiArrowBack } from 'react-icons/bi'
import { GiPauseButton, GiPlayButton } from 'react-icons/gi'

export default function Editor() {
    let minBound = 0;

    const [width, setWidth] = useState(window.innerWidth-66);
    const [height, setHeight] = useState(window.innerHeight);

    const [maxBound, setMaxBound] = useState(width-4);

    const [startRightBound, setStartBound] = useState(maxBound);
    const [endLeftBound, setEndBound] = useState(0);
    const graphsVideoRef = useRef(null);
    const [seekerPos, changeSeekerPos] = useState(0);
    const [videoPlaying, changeVideoPlaying] = useState(false);
    const [tmpSeekPos, changeTmpSeekPos] = useState(null);

    const [playedSeconds, updatePlayedSeconds] = useState(0);



    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);

    }

    function handleDrag(data, name) { // controls how to seekers behave when they are dragged
        if (name === "start") {
            changeSeekerPos(data.x);
            graphsVideoRef.current.seekTo(data.x);
            setEndBound(data.x);
            changeVideoPlaying(true);

        } else if (name === "end") { 
            changeSeekerPos(data.x);
            graphsVideoRef.current.seekTo(seekerPos);
            setStartBound(data.x);
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
                    graphsVideoRef.current.seekTo(startRightBound);
                    changeTmpSeekPos(null);
                } else {
                    changeSeekerPos(tmpSeekPos);
                    graphsVideoRef.current.seekTo(tmpSeekPos);
                }
            }
        } else if (trimmer === "start") {
            changeSeekerPos(startRightBound);
            graphsVideoRef.current.seekTo(startRightBound);
            changeTmpSeekPos(null);
        }
    }

    function handleProgress(state) { //This function seems good and is used to bound the seeker between the handles
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
        console.log(maxBound, startRightBound, endLeftBound, seekerPos)
        setMaxBound(width)
        changeSeekerPos(minBound)
        console.log(maxBound, startRightBound, endLeftBound, seekerPos)
    }, []);
    return (
        <div id="container" className="flex flex-col h-full" >
            <div style={{ margin: 33, width: '100%', height: height-120, alignContent: "center", backgroundColor: '#000', maxHeight: height, maxWidth: width }
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
                <div>
                    <ClickableDiv className="md:w-32" id="containerBox" style={{ overflow: 'visible', position: 'relative', backgroundColor: "#FFFFFF", width: maxBound, marginLeft: 'auto', marginRight: 'auto', maxWidth: maxBound}} onClick={(event) => { changeSeekerPos(event.pageX); graphsVideoRef.current.seekTo((event.pageX-33)/maxBound); }} >

                        <div className="box" style={{ width: '100%', top: 66/2, position: 'absolute', padding: 0, backgroundColor: 'rgba(46, 46, 46, 1)', border: 0, height: 4, marginLeft: 'auto', marginRight: 'auto', maxWidth: maxBound}} ></div> {/*66/2 is just a design number, to allign bold line with dotted line, the same with height(4)*/}

                        <Draggable
                            axis="x"
                            onDrag={(e, data) => handleDrag(data, "seeker")}
                            id="seeker"
                            defaultPosition={{ x: minBound, y: 0 }}
                            bounds={{ left: endLeftBound, right: startRightBound }}
                            position={{ x: seekerPos, y: 0 }}
                        >
                            <div style={{ width: 1 }}>
                                <div className="box" style={{ width: 'auto', margin: 0, position: 'absolute', left: -33, padding: 0, backgroundColor: '#FFFFFF', border: 0, height: 20 }} > {/* design for time-box */}
                                    {timeFormat(playedSeconds)}
                                </div>
                                <div className="seeker" style={{ width: 0, margin: 0, padding: 0, backgroundColor: 'rgba(46, 46, 46, 1)', border: 2, height: 50, borderStyle: 'solid', borderColor: 'rgba(46, 46, 46, 1)', borderTop: 0, borderBottom: 0 }} />
                            </div>
                        </Draggable>

                        <div className="asdasd" style={{marginTop: -30, overflow: 'hidden'}}>
                            {/* Left bound */}
                            <div className="boxL" style={{ position: 'absolute', borderColor: 'rgba(46, 46, 46, 1)', backgroundColor: "#FFFFFF", left: 0, width: endLeftBound, top: 33, borderWidth: 3, borderStyle: 'dashed', borderRadius: 1, borderTop: 0, height: 1 }}></div>

                            {/* Right bound */}
                            <div className="boxR" style={{ position: 'absolute', borderColor: 'rgba(46, 46, 46, 1)', backgroundColor: "#FFFFFF", left: startRightBound , width: width - startRightBound, direction: 'ltr', top: 66 / 2, borderWidth: 3, borderStyle: 'dashed', borderRadius: 1, borderTop: 0, height: 1 }} ></div> {/*den hvite tingen på siden*/}

                            <Draggable
                                axis="x"
                                onDrag={(e, data) => handleDrag(data, "start")}
                                onStart={() => hideSeeker()}
                                onStop={() => showSeeker()}
                                id="start"
                                defaultPosition={{ x: minBound, y: 1 }}
                                bounds={{ left: minBound, right: startRightBound - 40 }}
                            >
                                <div className="seeker" style={{ width: 0, margin: 0, padding: 0, backgroundColor: 'rgba(46, 46, 46, 1)', border: 2, height: 26, borderStyle: 'solid', borderColor: 'rgba(46, 46, 46, 1)', borderTop: 0, borderBottom: 0 }} ></div>
                            </Draggable>
                            <Draggable
                                axis="x"
                                onDrag={(e, data) => handleDrag(data, "end")}
                                onStart={() => hideSeeker("end")}
                                id="end"
                                defaultPosition={{ x: maxBound, y: -25 }}
                                bounds={{ left: endLeftBound + 40, right: maxBound-4 }}
                            >
                                <div className="seeker" style={{ width: 0, margin: 0, padding: 0, backgroundColor: 'rgba(46, 46, 46, 1)', border: 2, height: 26, borderStyle: 'solid', borderColor: 'rgba(46, 46, 46, 1)', borderTop: 0, borderBottom: 0 }} ></div>
                            </Draggable>
                        </div>
                    </ClickableDiv>
                </div>

            </div >
            <div style={{ display: 'flex', position: "absolute", bottom: 0, width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, marginTop: 5 }}>
                <div className="" onClick={back} style={{ padding: 10, marginLeft: 20, marginRight: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', fontSize: 15 }}><BiArrowBack size={18} style={{ marginRight: 5 }} />  Back</div>
                <div className="" onClick={pause} style={{ height: 'auto' }}> {videoPlaying
                    ? <GiPauseButton size={20} style={{ height: 'auto' }} />
                    : <GiPlayButton size={20} style={{ height: 'auto' }} />}</div>
                <div onClick={next} style={{ backgroundColor: "#131312", color: "#FFFFFF", padding: 10, borderRadius: 25, marginRight: 20, marginLeft: 20, display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 13, paddingRight: 13, fontSize: 15 }}>Next <BiArrowBack size={18} style={{ transform: 'scaleX(-1)', marginLeft: 5 }} /></div>
            </div >
        </div >
    )
}


