import { createSignal, onMount } from "solid-js";
import {FlowContainer} from "../../plugins/FlowEditor/FlowEditor";
import {deleteNodeScript , addNodeScript} from '../../plugins/FlowEditor/FlowScript';
import { windowData } from "../../scripts/store";
import ContextMenu from "./ContextMenu";
const NodeEditor = () => {
  const FlowStores  = windowData[0].flowEditor;
  const [context, setContext] = createSignal([]);
  const hideContextMenu = () => $('#FlowContextMenu').hide();
  const id = 'FlowEditor-app';

  $(window).on("mousedown.event", e => {
    if (e.target.offsetParent != $('#FlowContextMenu')[0]) {
      hideContextMenu();
    }
  });
  
  const contextMenu = e => {
    e.preventDefault();
    const classes = typeof e.target.className === 'string' ?  e.target.className.split(/\s+/) : [];
    if(classes[0] !== 'FN_draggable'){
      setContext(classes);
      $('#FlowContextMenu').css({
        top:e.clientY-50+'px',
        left: e.clientX+'px'
      });
      $('#FlowContextMenu').show();
    }
  }

  const createNewNode = () => {
    addNodeScript(FlowStores,{
      inputs:['a','b','c'],
      outputs:['out1','out2'],
      x:0,
      y:0,
    });
    hideContextMenu();
  }

  const deleteNode = (e) => {
    const node = e.find(x => x.includes('FN_node')).split('FN_node_')[1];   
    deleteNodeScript(node,FlowStores);
    hideContextMenu();
  }

  return (
    <div onContextMenu={e => contextMenu(e)} style="height: 100%;width: 100%;">
      <FlowContainer 
      id={id} 
      FlowStores={FlowStores}>
      </FlowContainer>
      <ContextMenu 
      id="FlowContextMenu" 
      context={context()}
      newNode={createNewNode}
      deleteNode={deleteNode}
      ></ContextMenu>
    </div>

  )
}

export default NodeEditor