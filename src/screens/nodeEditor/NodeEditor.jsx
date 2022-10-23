import { createSignal, onMount } from "solid-js";
import {FlowContainer} from "../../plugins/FlowEditor/FlowEditor";
import {deleteNodeScript , addNodeScript} from '../../plugins/FlowEditor/FlowScript';
import { windowData } from "../../scripts/store";
import ContextMenu from "./ContextMenu";
const NodeEditor = () => {
  const FlowStores  = windowData[0].flowEditor;
  const [context, setContext] = createSignal([]);

  onMount(()=> {
    $('#FlowEditor-app').contextmenu(e => {
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
    });

    $(window).on("mousedown", e => {
      if (e.target.offsetParent != $('#FlowContextMenu')[0]) {
        $('#FlowContextMenu').hide();
      }
    });
  });

  const createNewNode = () => {
    addNodeScript(FlowStores,{
      inputs:['a','b','c'],
      outputs:['out1','out2'],
      x:0,
      y:0,
    });

  }

  const deleteNode = (e) => {
    const node = e.find(x => x.includes('FN_node')).split('FN_node_')[1];   
    deleteNodeScript(node,FlowStores);
  }

  return (
    <>
      <FlowContainer 
      id="FlowEditor-app" 
      FlowStores={FlowStores}>
      </FlowContainer>
      <ContextMenu 
      id="FlowContextMenu" 
      context={context()}
      newNode={createNewNode}
      deleteNode={deleteNode}
      ></ContextMenu>
    </>

  )
}

export default NodeEditor