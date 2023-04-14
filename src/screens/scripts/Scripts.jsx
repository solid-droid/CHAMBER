import { editor } from "monaco-editor";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if(label === 'json')
      return new jsonWorker()
    if(['css','scss','less'].includes(label))
      return new cssWorker()
    if(['html', 'handlebars', 'razor'].includes(label))
      return new htmlWorker();
    if(label === 'typescript' || label === 'javascript')
      return new tsWorker();
    
      return new editorWorker();
  }

}

import {openMenu} from '../../scripts/store';
import { createEffect } from "solid-js";
import './Scripts.css';
import ScriptEditorToolbar from "./ScriptEditorToolbar";

function Scripts() {
    const [menu] = openMenu;
    let editorDOM;
    let scriptEditor;
    createEffect(()=>{
        if(menu.scripts){
          if(!scriptEditor)
            init();
        } else {
          scriptEditor?.onDidDispose(()=> scriptEditor = null);
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
        scriptEditor = editor.create(editorDOM, {
            value,
            language: "javascript",
            automaticLayout: true,
            theme:'vs-dark'
        });
    }
    return (
    <>
        <ScriptEditorToolbar></ScriptEditorToolbar>
        <div id="ScriptEditor" ref={editorDOM}></div>
    </>
  )
}

export default Scripts