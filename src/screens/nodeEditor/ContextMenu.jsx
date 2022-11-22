import { createEffect, createSignal } from 'solid-js';
import './contextMenu.css';
const ContextMenu = (props) => {

    const [type , setType] = createSignal(0);

    createEffect(()=>{
       switch(props.context[0]){
        case 'FlowEditor-app' : setType(0);break;
        default: setType(1);break;
       }
    });

    createEffect(() => {})


  return (
    <div id={props.id} class="NodeEditor_contextMenu">
        <Show when={type() == 0}>
          <div class="defaultContent">
          <div class="column">
            <div class="section">Widgets</div>
              <div class="item" onClick={(e) => props.newNode(e , 'InputBox')}>InputBox</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Slider')}>Slider</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Toggle')}>Toggle</div>
              <div class="item" onClick={(e) => props.newNode(e , 'HTML Widget')}>Custom</div>
            <div class="section" style="margin-top:10px;">Simulator</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Box3D')}>Box</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Box3D')}>Sphere</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Box3D')}>Custom</div>
          </div>
          <div class="column">
            <div class="section">Signals</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Input Signal')}>Input</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Output Signal')}>Output</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Log Signal')}>Log</div>
            <div class="section" style="margin-top:10px;">Logic</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Join')}>Join</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Split')}>Split</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Javascript')}>Javascript</div>
          </div>
          </div>
        </Show>
        <Show when={type() == 1}>
            <div class="item" onClick={() => props.editNode(props.context)}>Edit</div>
            <div class="item" onClick={() => props.deleteNode(props.context)}>Delete</div>
        </Show>
    </div>
  )
}

export default ContextMenu