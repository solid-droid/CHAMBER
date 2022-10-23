import { For,  onMount } from "solid-js";
import {produce} from "solid-js/store"
import Moveable from "moveable";
import {getPropertiesForArrow, createArrowLine} from './FlowScript';

const FlowNode = (props) => {
  const [nodeObj , setNodeObj] = props.nodeObj;
  const [nodeList , setNodeList] = props.nodeList;
  const [node, setNode] = props.nodeStore;
  const [connection , setConnection] = props.connectionStore;
  const [connectionList , setConnectionList] = props.connectionList;
  const [layout] = props.layoutStore;
  let widget;
  const createMoveable = () => {
    widget =  new Moveable(document.querySelector(`#${layout.id} .viewport`), {
      // dragTarget: document.querySelector(`#${props.id} .FN_head`),
      target :document.querySelector(`#${props.id}`),
      origin: false,
      draggable: true,
  }).on("dragStart", (e) => {
    if($(`#${layout.id}`).find(".FN_draggable:hover").length){
      setConnection({isDragging:true});
      e.stop();
    } else {
      setNode({isDragging:true, selectedNode:props.id});
    }
  }).on("drag", ({target,left, top}) => {
        $(`#${layout.id} .connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
        $(`#${layout.id} .connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
        setNodeObj(props.id , item => ({
            ...item,
            x: left,
            y: top
        }));
        
        nodeObj[props.id].connections?.forEach(item => {
          const {fromXY, toXY} = getPropertiesForArrow({
            ...item,
            nodeObj,
            layout
          })
          item.arrow.update({source:fromXY , destination: toXY});
        });
  }).on("dragEnd",()=>{
      setNode({isDragging:false});
      setNodeList(_node => {
        const k = _node.find(i => i.id == props.id)
        k.x = nodeObj[props.id].x;
        k.y = nodeObj[props.id].y;
        return _node;
      })
  });

  setNodeObj(props.id , item => ({
    ...item,
    widget
  }));

  }

  const getXY = (e) => ({
            x:e.clientX / layout.z, 
            y:(e.clientY - 55) / layout.z
          });
  const beginGhostConnection = e =>{
    $(`#${layout.id} .ghostSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
    $(`#${layout.id} .ghostSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
    
    $(`#${layout.id} .connectionGhost`).show();
    $(`#${layout.id} .connectionGhost`).css({left:`${screenX}px`});
    $(`#${layout.id} .connectionGhost`).css({top:`${screenY}px`});
    
    const _classes = e.target.className.split(/\s+/);
    const _port = parseInt(_classes[1].split('FN_port_')[1]);
    const _node = _classes[2].split('FN_node_')[1];
    const ghostArrow = {node : _node, port: _port+1};
    const fromXY = getXY(e);
    const arrow =  createArrowLine(fromXY,fromXY,`#${layout.id}`, '.ghostSVG');
    setConnection({selectedNode:ghostArrow , arrow:arrow ,fromXY});

  }

  const drawGhostConnection = e => {
    $(`#${layout.id} .connectionGhost`).css({left:`${screenX}px`});
    $(`#${layout.id} .connectionGhost`).css({top:`${screenY}px`});
    const fromXY = connection.fromXY;
    const toXY = getXY(e);
    connection.arrow.update({source:fromXY , destination: toXY})
  }

  const endGhostConnection = e => {
    setConnection({selectedNode:null});
    connection.arrow.remove();
    $(`#${layout.id} .connectionGhost`).hide();
  }

  const dropGhostConnection = e => {
    e.preventDefault();
    const _classes = e.target.className.split(/\s+/);
    const toPort = parseInt(_classes[1].split('FN_port_')[1])+1;
    const toNode = _classes[2].split('FN_node_')[1];
    const {node:fromNode, port:fromPort} = connection.selectedNode;
    setConnectionList(_conn => {
      if(!_conn.find(item =>
         item[1][0] == toNode &&
         item[1][1] == toPort
        )){
          
          const _item = [[fromNode,fromPort],[toNode,toPort]];
          return [_item, ..._conn];
        } else {
          console.log('connection already exists');
        }
        return _conn;
    });
  }

  const ondragoverGhostConnection = e =>{
    e.preventDefault();
  }

  const inputContextMenu = e => {
    e.preventDefault();
    const _classes = e.target.className.split(/\s+/);
    const toPort = parseInt(_classes[1].split('FN_port_')[1])+1;
    const toNode = _classes[2].split('FN_node_')[1];
    const prevLen = connectionList().length;
    setConnectionList(_conn => {
     return _conn.filter(item => !(item[1][0] == toNode && item[1][1] == toPort));
    });
    const newLen = connectionList().length;

    if(prevLen !== newLen){
      //deleted
      setConnection({deletedConnection : {toNode, toPort}});
    }

  };

  onMount(async ()=>{
    setNodeObj({
      [props.id]:{
        x:props.x || 0,
        y:props.y || 0
      }
    });
    createMoveable();
  });

  return (
      <div id={props.id} class="FlowNode" style={`left:${props.x || 0}px; top:${props.y || 0}px;`}>
          <div class={`FN_head FN_node_${props.id}`}>
              {props.id}
          </div>
          <div class={`FN_body FN_node_${props.id}`}>
              <div class={`FN_inputs FN_node_${props.id}`}>
              <For each={props.inputs}>
                  {(item,i) => 
                  <div class={`FN_inputItem FN_port_${i()} FN_node_${props.id}`}>
                    <div class={`FN_draggable FN_port_${i()}  FN_node_${props.id}`} 
                    draggable="false"
                    onContextMenu={e => inputContextMenu(e)}
                    ondrop={e => dropGhostConnection(e)} 
                    ondragover={e => ondragoverGhostConnection(e)} 
                    ></div>
                    <div class={`FN_title FN_port_${i()} FN_node_${props.id}`}  draggable="false">{item}</div>
                  </div>
                  }
              </For>
              </div>
              <div class={`FN_content FN_node_${props.id}`}>
                {props.children}
              </div>
              <div class={`FN_outputs FN_node_${props.id}`}>
              <For each={props.outputs}>
                  {(item, i) => 
                    <div class={`FN_outputItem FN_node_${props.id}`}>
                        <div class={`FN_title FN_port_${i()} FN_node_${props.id}`} draggable="false">{item}</div>
                        <div class={`FN_draggable FN_port_${i()} FN_node_${props.id}`} draggable="true" 
                              onDragStart={e => beginGhostConnection(e)} 
                              onDrag={e => drawGhostConnection(e)} 
                              onDragEnd={e => endGhostConnection(e)}
                        ></div>
                    </div>
                  }
              </For>
              </div>
          </div>
      </div>

  )
}

export default FlowNode