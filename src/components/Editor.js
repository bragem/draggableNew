import Draggable from "react-draggable";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";
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
    // const [endPos, changeEndPos] = useState(minBound + radius * 2);

    //TODO make div clcikable, so that the videoRef moves and drags to wherever the mouse clicks in the progressbar

    function handleDrag(data, name) {
        if (name === "start") {
            // if (data.x + radius * 2 > seekerPos) {

            // }

            changeSeekerPos(data.x + radius * 2);
            graphsVideoRef.current.seekTo(data.x / maxBound);
            setEndBound(data.x + radius * 2);


        } else if (name === "end") {
            setStartBound(data.x - radius * 2);

        }
        else if(name === "seeker"){
            let pos = data.x/maxBound
            graphsVideoRef.current.seekTo(pos);
            changeSeekerPos(pos)
        }


    }

    function handleProgress(state) {
        let x = state.played * maxBound;
        console.log(x);
        changeSeekerPos(x);
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


    return (
        <div style={{ margin: 20 }}>


            <ReactPlayer
                ref={graphsVideoRef}
                url='https://www.youtube.com/watch?v=NKaA0IPcD_Q&ab_channel=IB-PROCADDd.o.o.'
                controls={true}
                onProgress={(state) => handleProgress(state)}

            />

            <Draggable
                axis="x"
                onDrag={(e, data) => handleDrag(data, "start")}
                id="start"
                defaultPosition={{ x: minBound, y: 0 }}
                bounds={{ left: minBound, right: startRightBound }}
            >
                <div className="box" style={{width: 6, margin: 0, padding: 0, backgroundColor: 'red', border: 0, height: 70}}/>
            </Draggable>

            <Draggable
                axis="x"
                onDrag={(e, data) => handleDrag(data, "seeker")}
                id="seeker"
                defaultPosition={{ x: minBound, y: 0 }}
                bounds={{ left: endLeftBound + 10, right: startRightBound - 3 }}
                position={{ x: seekerPos, y: 0 }}
            >
                <div className="seeker" style={{width: 3, margin: 0, padding: 0, backgroundColor: 'gray', border: 0, height: 70}}/>
            </Draggable>

            <Draggable
                defaultPosition={{ x: maxBound - 3, y: -70 }}
                axis="x"
                onDrag={(e, data) => handleDrag(data, "end")}
                id="end"
                bounds={{ left: endLeftBound, right: maxBound - 3 }}
            >
                <div className="box" style={{width: 6, margin: 0, padding: 0, backgroundColor: 'red', border: 0, height: 70}}/>
            </Draggable>
        </div >

    )
}


