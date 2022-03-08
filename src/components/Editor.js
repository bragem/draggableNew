import Draggable from "react-draggable";
import {useState} from "react";
const radius = 35

export default function Dragger(){
    const [startPos, setStartPosition] = useState({ x: 0, y: 0 });
    const [endPos, setEndPosition] = useState({ x: 0, y: 0 });


    function checkStartCollision(data) {
        setStartPosition({ x: data.x, y: data.y });
        if(startPos.x+radius>=endPos.x-radius){
            setStartPosition({x:data.x+radius, y:data.y})
            console.log("hei")
        }
    }


    function checkEndCollision(data) {
        setEndPosition({ x: data.x, y: data.y });
        if(endPos.x-radius<=startPos.x+radius){
            // endPos.x = startPos.x
            console.log("hallo")
        }
    }


    return (
        <div>
            <Draggable
                axis="x"
                onDrag={(e,data) => checkStartCollision(data)}
                id="start"
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


