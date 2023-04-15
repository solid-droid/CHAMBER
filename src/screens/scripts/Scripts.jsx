import { editor, languages, Position, Range } from "monaco-editor";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import { currentScript, debuggerInput, debuggerOutput } from "./scriptStore";
import {openMenu} from '../../scripts/store';
import { createEffect, createSignal } from "solid-js";
import './Scripts.css';
import ScriptEditorToolbar from "./ScriptEditorToolbar";


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



function Scripts() {
    const [menu] = openMenu;
    let editorDOM, outputDOM, scriptEditor;
    const [minimizeHelper , setMinimizeHelper] = createSignal(true);
    createEffect(()=>{
        if(menu.scripts){
          if(!scriptEditor)
            init();
        } else {
          scriptEditor?.onDidDispose(()=> scriptEditor = null);
          scriptEditor?.dispose();
        }
      });

    function init(){
        scriptEditor = editor.create(editorDOM, {
            value:currentScript[0](),
            language: "javascript",
            automaticLayout: true,
            theme:'vs-dark'
        });
        languages.registerCompletionItemProvider('javascript', {
          provideCompletionItems: function(model, position) {
            return {
                suggestions: [
                  {
                    label: 'Chamber.input',
                    kind: languages.CompletionItemKind.Snippet,
                    insertText: 'Chamber.input()',
                    detail: 'get input from blueprint',
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
                  }, 
                  {
                    label: 'Chamber.ouput',
                    kind: languages.CompletionItemKind.Snippet,
                    insertText: 'Chamber.output(',
                    detail: 'set output into blueprint',
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
                  }, 
                  {
                    label: 'Chamber.store',
                    kind: languages.CompletionItemKind.Snippet,
                    insertText: 'Chamber.store(',
                    detail: 'store in variable store - global/blueprint level',
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
                  }, 
                  {
                    label: 'Chamber.get',
                    kind: languages.CompletionItemKind.Snippet,
                    insertText: 'Chamber.get(',
                    detail: 'get from variable store - global/blueprint level.',
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
                  }, 
                  {
                    label: 'Chamber.wait',
                    kind: languages.CompletionItemKind.Snippet,
                    insertText: 'Chamber.wait(',
                    detail: 'delay execution for given ms',
                    insertTextRules: languages.CompletionItemInsertTextRule.InsertAsSnippet
                  }, 
                ]
            };
        }
        });

        languages.registerHoverProvider('javascript', {
          provideHover: function(model, position) { 
              // Log the current word in the console, you probably want to do something else here.
          let content, startColumn;
          let helperItems = {
            input :  '<div><span style="color:#64daff;">Chamber.input()</span></div><div><span style="color:#999999;">get inputs from Blueprint</span></div>',
            output:  '<div><span style="color:#64daff;">Chamber.output(value)</span></div><div><span style="color:#999999;">output a value to Blueprint</span></div>',
            store:  '<div><span style="color:#64daff;">Chamber.store(key, value, global = false)</span></div><div><span style="color:#999999;">variable store - global/blueprint level.</span></div>',
            get:  '<div><span style="color:#64daff;">Chamber.get(key, global = false)</span></div><div><span style="color:#999999;">access stored values from global/blueprint.</span></div>',
            wait:  '<div><span style="color:#64daff;">Chamber.wait(ms)</span></div><div><span style="color:#999999;">delay execution for given ms</span></div>',
          }
          const word = model.getWordAtPosition(position)
          if(word?.word === 'Chamber'){
            content = [...Object.values(helperItems).map(x => x+'<br>')].join('');
            startColumn = word.startColumn;
          }
      
          if(['input','output','store','get','wait'].includes(word?.word)){
          const parentWord = model.getWordAtPosition(new Position(position.lineNumber, word.startColumn-1))
            if(parentWord?.word === 'Chamber' ){
              content = helperItems[word.word];
              startColumn = parentWord.startColumn
            }
          }

          if(content)
          return {
            contents: [
                {
                    supportHtml: true,
                    value: content
                }
              ],
              range: new Range(
                position.lineNumber,
                startColumn,
                position.lineNumber,
                word.endColumn
            ),
           }
      }});


        scriptEditor.getModel().onDidChangeContent((event) => {
          currentScript[1](scriptEditor.getValue());
        });
    }

    createEffect(() => {
      outputDOM.value = debuggerOutput[0]();
    });
    return (
    <>
        <ScriptEditorToolbar></ScriptEditorToolbar>
        <div id="ScriptEditor" ref={editorDOM}></div>
        <div id="ScriptHelper" class={minimizeHelper() ? 'helperMinSize': 'helperFullSize'}>
          <div class="h1" onClick={e => setMinimizeHelper(x => !x)}>
            <div>Debugger</div>
            <div><i class={minimizeHelper() ?"fa-solid fa-square-caret-up" : "fa-solid fa-square-caret-down"}></i></div>
          </div>
          <div class="h2">Input</div>
          <textarea class="textArea" onChange={e => debuggerInput[1](e.currentTarget.value)}>{debuggerInput[0]()}</textarea>
          <div class="h2">Output</div>
          <textarea class="textArea" ref={outputDOM} disabled>{debuggerOutput[0]()}</textarea>
        </div>
    </>
  )
}

export default Scripts