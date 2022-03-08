import './App.css';
import React, { useState } from "react";
import Editor from "./components/Editor";


function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const trackPos = (data) => {
    setPosition({ x: data.x, y: data.y });
  };


  return (
    <div className="App">

    <div id="wrapper">
      <Editor
      axis="x"
      defaultPosition={{x: 550, y: 400}}
      onDrag={(e, data) => trackPos(data)}
      >
      </Editor>
    </div>


    </div>
  );
}


export default App;
