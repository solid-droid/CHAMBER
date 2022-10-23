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
    <div id={props.id}>
        <Show when={type() == 0}>
            <div onClick={() => props.newNode()}>New</div>
        </Show>
        <Show when={[1,2,3,4].includes(type())}>
            <div onClick={() => props.deleteNode(props.context)}>Delete</div>
        </Show>
    </div>
  )
}

export default ContextMenu