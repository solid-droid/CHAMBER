import { createSignal, onMount } from "solid-js";
import {FlowContainer} from "../../plugins/FlowEditor/FlowEditor";

import {deleteNode , addNode} from '../../plugins/FlowEditor/FlowScript';
import { windowData, popupData } from "../../scripts/store";

import ContextMenu from "./ContextMenu";
import NodeEditorToolbar from "./NodeEditorToolbar";

const NodeEditor = () => {
  const FlowStores  = windowData[0].flowEditor;
  const [layout] = FlowStores.layoutStore;
  const [popup, setPopup] = popupData;
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
    if(!['','FN_draggable'].includes(classes[0])){
      setContext(classes);
      const _width = $('#FlowEditor-app').width();
      const _height = $('#FlowEditor-app').height();
      const _top = $('#FlowEditor-app')[0].getBoundingClientRect().top;
      const _left = $('#FlowEditor-app')[0].getBoundingClientRect().left;
      let left = e.clientX-_left , top = e.clientY-_top;

      if(_width- left < 200){
        left-=140;
      }

     const boxH = parseInt($('#FlowContextMenu').css('height').split('px')[0]);
     const midMin = _height/2 - boxH/2 - boxH/3;
     const midMax = _height/2 + boxH/2 - boxH/3;
     if(_height - top < boxH + 50){
      if( midMin <top && midMax>top)
      top-=boxH/2
      else
      top-=boxH + 10
     }

      $('#FlowContextMenu').css({
        top: top+'px',
        left: left+'px'
      });
      $('#FlowContextMenu').show();
    }
  }

  const config = {
    'Input Signal':{
      inputs:[],
      outputs:['output'],
      name:'undefined',
      dataflow: 'input'
    },
    'Output Signal':{
      inputs:['input'],
      outputs:[],
      name:'undefined',
      dataflow: 'output'
    },
    'Log Signal':{
      inputs:['input'],
      outputs:[],
      name:'undefined',
      dataflow: 'output'
    },
    'Box3D':{
      inputs:['position','scale'],
      outputs:[],
      position:[0,0,0],
      scale:[0,0,0],
      name:'undefined',
      dataflow: 'output'
    },
    'Sphere3D':{
      inputs:['position','scale'],
      outputs:[],
      position:[0,0,0],
      scale:[0,0,0],
      name:'undefined',
      dataflow: 'output'
    },
    'InputBox':{
      inputs:[],
      outputs:['value'],
      value:0,
      type:'number',
      dataflow: 'input'
    },
    'Slider':{
      inputs:[],
      outputs:['value'],
      min:0,
      max:10,
      value:5,
      step:1,
      dataflow: 'input'
    },
    'Toggle' : {
      inputs:[],
      outputs:['value'],
      value:true,
      dataflow: 'input'
    },
    'Javascript' : {
      inputs:['input'],
      outputs:['output'],
      script:'',
      dataflow: 'control'
    },
    'Join' : {
      inputs:['a','b','c','d'],
      outputs:['value'],
      dataflow: 'control'
    },
    'Split' : {
      inputs:['value'],
      outputs:['a','b','c','d'],
      dataflow: 'control'
    },
    'HTML Widget' : {
      inputs:['input'],
      outputs:['output'],
      html:'',
      dataflow: 'control'
    }
  }
  const createNewNode = (e,type) => {
    const _top = $('#FlowEditor-app')[0].getBoundingClientRect().top;
    const _left = $('#FlowEditor-app')[0].getBoundingClientRect().left;
    addNode(FlowStores,{
      title:type,
      ...config[type],
      x:(e.clientX-layout.x-_left)/layout.z,
      y:(e.clientY-layout.y-_top)/layout.z,
    });
    hideContextMenu();
  }

  const deleteExistingNode = (e) => {
    try{
      const node = e.find(x => x.includes('FN_node')).split('FN_node_')[1];   
      deleteNode(node,FlowStores);
    } catch(e){
      alert('Something went wrong.please try again.')
    }

    hideContextMenu();
  }

  const editNode = (e) => {
    try{
      const node = e.find(x => x.includes('FN_node')).split('FN_node_')[1];   
      setPopup({open:true , type:'editNode', node});
    } catch(e){
      alert('Something went wrong, pleae try again !');
      console.log(e);
    }

  }

  return (
    <>
    <NodeEditorToolbar></NodeEditorToolbar>
    <div onContextMenu={e => contextMenu(e)} style="height: 100%;width: 100%;">
      <FlowContainer 
      id={id} 
      FlowStores={FlowStores}>
      </FlowContainer>
      <ContextMenu 
      id="FlowContextMenu" 
      context={context()}
      newNode={createNewNode}
      deleteNode={deleteExistingNode}
      editNode={editNode}
      ></ContextMenu>
    </div>
    </>
  )
}

export default NodeEditor