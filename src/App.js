import './App.css';
import Draggable from "react-draggable";
import React, { useState } from "react";


function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const trackPos = (data) => {
    setPosition({ x: data.x, y: data.y });
  };


  return (
    <div className="App">

    <div id="start">
      <Draggable
      axis="x"
      defaultPosition={{x: 550, y: 800}}
      onDrag={(e, data) => trackPos(data)}
      >
        <div className="box">
          <div>Move me around!</div>
        </div>
      </Draggable>
    </div>

    <div id="end">
      <Draggable
          axis="x"
          defaultPosition={{x: 800, y: 800}}
          onDrag={(e, data) => trackPos(data)}
      >
        <div className="box">
          <div>x: {position.x.toFixed(0)}, y: {position.y.toFixed(0)}</div>
        </div>
      </Draggable>

    </div>


    </div>
  );
}


export default App;
