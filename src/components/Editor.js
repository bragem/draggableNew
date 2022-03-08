import Draggable from "react-draggable";
import {useState} from "react";
const radius = 35

export default function Editor(){
    const [startPos, setStartPosition] = useState({ x: 0, y: 0 });
    const [endPos, setEndPosition] = useState({ x: 200, y: 0 });


    function checkStartCollision(data) {
        setStartPosition({ x: data.x, y: data.y });
        if(startPos.x+radius>=endPos.x-radius){
            //forsøk på å endre posisjon manuelt når boksene kolliderer, funker ikke
            // setStartPosition({x:data.x+radius, y:data.y})
            console.log("Startbox collision")
        }
    }


    function checkEndCollision(data) {
        setEndPosition({ x: data.x, y: data.y });
        if(endPos.x-radius<=startPos.x+radius){
            // endPos.x = startPos.x
            console.log("Endbox collision")
        }
    }


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
        <div>
            <Draggable
                axis="x"
                onDrag={(e,data) => checkStartCollision(data)}
                id="start"
                defaultPosition={{x: 0, y: 0}}
            >
                <div className="box">Start</div>
            </Draggable>
            <Draggable
                defaultPosition={{x: 200, y: 0}}
                axis="x"
                onDrag={(e,data) => checkEndCollision(data)}
                id="end"
            >
                <div className="box">End</div>
            </Draggable>
        </div>

    )
}


