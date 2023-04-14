import { editor } from "monaco-editor";
import {openMenu} from '../../scripts/store';
import { createEffect } from "solid-js";
import './Scripts.css';
import ScriptEditorToolbar from "./ScriptEditorToolbar";

function Scripts() {
    const [menu] = openMenu;
    let scriptEditor;
    createEffect(()=>{
        if(menu.scripts){
          init();
        } else {
           scriptEditor?.dispose();
        }
      });

    const value =
`/*//////////////////////////////////////////////////////
Chamber Script Editor - 
Write your logic Scripts in restricted Javascript.
Use Script Node in Blueprint to use your logic script.
Executes in isolation.
//////////////////////////////////////////////////////*/
`
    function init(){
        scriptEditor = editor.create(document.getElementById("ScriptEditor"), {
            value,
            language: "javascript",
            automaticLayout: true,
            theme:'vs-dark'
        });
    }
    return (
    <>
        <ScriptEditorToolbar></ScriptEditorToolbar>
        <div id="ScriptEditor"></div>
    </>
  )
}

export default Scripts