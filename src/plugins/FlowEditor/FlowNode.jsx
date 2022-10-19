import { For, onMount } from "solid-js";
import Moveable from "moveable";
import {getPropertiesForArrow} from './FlowScript';

const FlowNode = (props) => {
  const [nodes , setNodes] = props.nodeList;
  const [node, setNode] = props.nodeStore;
  const [connection , setConnection] = props.connectionStore
  const [layout] = props.layoutStore;
  let widget, activeConnections = [];
  const id = 'FlowEditor-app';
  const createMoveable = () => {
    widget =  new Moveable(document.querySelector(`#${id} .viewport`), {
      // dragTarget: document.querySelector(`#${props.id} .FN_head`),
      target :document.querySelector(`#${props.id}`),
      origin: false,
      draggable: true,
  })
  .on("dragStart", (e) => {
    
    if($(`#${id}`).find(".FN_draggable:hover").length){
      setConnection({isDragging:true, selectedNode:props.id});
      e.stop();
    } else {
      setNode({isDragging:true, selectedNode:props.id});
    }
  })
  .on("drag", ({target,left, top}) => {
        setNodes(props.id , item => ({
            ...item,
            x: left,
            y: top
        }))
        $(`#${layout.id} .connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
        $(`#${layout.id} .connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
        nodes[props.id].connections.forEach(item => {
          const {fromXY, toXY} = getPropertiesForArrow({
            ...item,
            nodes,
            layout
          })
          item.arrow.update({source:fromXY , destination: toXY});
        });
      target.style.left = `${left}px`;
      target.style.top = `${top}px`;
  })
  .on("dragEnd",()=>{
      setNode({isDragging:false});
  });
  }


  onMount(async ()=>{
    setNodes({
      [props.id]:{
        x:props.x || 0,
        y:props.y || 0
      }
    });
    createMoveable();
    $('').on({
      mouseenter: function () {
          //stuff to do on mouse enter
      },
      mouseleave: function () {
          //stuff to do on mouse leave
      }
  });
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
              {(item) => 
              <div class="FN_inputItem">
                <div class="FN_draggable" draggable="true"></div>
                <div class={`${item} FN_title`}  draggable="false">{item}</div>
              </div>
              }
          </For>
          </div>
          <div class="FN_content">
            {props.children}
          </div>
          <div class="FN_outputs">
          <For each={props.outputs}>
              {(item) => 
                <div class="FN_outputItem">
                    <div class={`${item} FN_title`} draggable="false">{item}</div>
                    <div class="FN_draggable" draggable="true"></div>
                </div>
              }
          </For>
          </div>
      </div>
    </div>
  )
}

export default FlowNode