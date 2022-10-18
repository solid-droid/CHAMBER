import { For, onMount } from "solid-js";
import Moveable from "moveable";

const FlowNode = (props) => {
  const [nodes , setNodes] = props.nodeList;
  const [node, setNode] = props.nodeStore;
  let widget;
  const id = 'FlowEditor-app';
  const createMoveable = () => {
    widget =  new Moveable(document.querySelector(`#${id} .viewport`), {
      target: document.getElementById(props.id),
      origin: false,
      edge:false,
      draggable: true,
  })
  .on("dragStart", ({ target, clientX, clientY }) => {
      setNode({isDragging:true});
  })
  .on("drag", ({
      target, transform,
      left, top, right, bottom,
      beforeDelta, beforeDist, delta, dist,
      clientX, clientY,
  }) => {
        setNodes(props.id , item => ({
            ...item,
            x: left,
            y: top
        }))
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
  })
  .on("dragEnd",()=>{
      setNode({isDragging:false});
  })
  }
  onMount(async ()=>{
    setNodes({
      [props.id]:{
        x:props.x || 0,
        y:props.y || 0
      }
    });
    console.log('test');
    createMoveable();
  });

  return (
    <div id={props.id} 
    class="FlowNode" 
    // style={`transform:translate(${props.x || 0}px, ${props.y || 0}px)`}
    style={`left:${props.x || 0}px; top:${props.y || 0}px;`}
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