import { createEffect, createSignal } from 'solid-js';
import './contextMenu.css';
const ContextMenu = (props) => {

    const [type , setType] = createSignal(0);

    createEffect(()=>{
       switch(props.context[0]){
        case 'FN_head' : setType(1);break;
        case 'FN_title': setType(2);break;
        case 'FN_content': setType(3);break;
        case 'FN_inputItem':
        case 'FN_inputs':
        case 'FN_outputs':
        case 'FN_outputItem':setType(4);break;
        default: setType(0);break;
       }
    });

    createEffect(() => {})


  return (
    <div id={props.id} class="NodeEditor_contextMenu">
        <Show when={type() == 0}>
            <div class="section firstSection">Connections</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Input Signal')}>Input Signal</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Output Signal')}>Output Signal</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Log Signal')}>Log Signal</div>
            <div class="section">Simulator</div>
              <div class="item" onClick={(e) => props.newNode(e , '3D Box')}>3D Box</div>
            <div class="section">Widgets</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Input')}>Input</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Slider')}>Slider</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Toggle')}>Toggle</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Button')}>JoyStick</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Button')}>Button</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Knob')}>Knob</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Chart')}>Chart</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Chart')}>Table</div>
            <div class="section">Helper</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Join')}>Join</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Split')}>Split</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Split')}>Condition</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Split')}>Loop</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Split')}>Arithmetic</div>
              <div class="item" onClick={(e) => props.newNode(e , 'Javascript')}>Javascript</div>
              <div class="item" onClick={(e) => props.newNode(e , 'HTML Widget')}>HTML Widget</div>
        </Show>
        <Show when={[1,2,3,4].includes(type())}>
            <div class="item" onClick={() => props.editNode(props.context)}>Edit</div>
            <div class="item" onClick={() => props.deleteNode(props.context)}>Delete</div>
        </Show>
    </div>
  )
}

export default ContextMenu