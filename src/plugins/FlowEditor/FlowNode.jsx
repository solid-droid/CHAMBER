import { For, onMount } from "solid-js";

const FlowNode = (props) => {
  const [nodes , setNodes] = props.nodeList;
  onMount(async ()=>{
    setNodes({
      [props.id]:{
        x:props.x || 0,
        y:props.y || 0
      }
    });
  });

  return (
    <div id={props.id} 
    class="FlowNode" 
    style={`transform:translate(${props.x || 0}px, ${props.y || 0}px)`}
    >
      <div class="FN_head">
          testBox
      </div>
      <div class="FN_body">
          <div class="FN_inputs">
          <For each={props.inputs}>
              {(item) => <div class={item}>{item}</div>}
          </For>
          </div>
          <div class="FN_content">
            {props.children}
          </div>
          <div class="FN_outputs">
          <For each={props.outputs}>
              {(item) => <div class={item}>{item}</div>}
          </For>
          </div>
      </div>
    </div>
  )
}

export default FlowNode