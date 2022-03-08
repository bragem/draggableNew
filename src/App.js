import './App.css';
import React from "react";
import Editor from "./components/Editor";


function App() {

  return (
    <div className="App">

      <div id="wrapper">
        <Editor
        axis="x"
        defaultPosition={{x: 550, y: 400}}
        >
        </Editor>
      </div>


    </div>
  );
}


export default App;
