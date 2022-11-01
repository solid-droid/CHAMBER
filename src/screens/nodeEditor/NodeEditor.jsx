import { createSignal, onMount } from "solid-js";
import {FlowContainer} from "../../plugins/FlowEditor/FlowEditor";
import {deleteNode , addNode} from '../../plugins/FlowEditor/FlowScript';
import { windowData, popupData } from "../../scripts/store";
import ContextMenu from "./ContextMenu";
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
    if(classes[0] !== 'FN_draggable'){
      setContext(classes);
      let left = e.clientX , top = e.clientY-50;

      if(window.innerWidth - left < 200){
        left-=140;
      }

     const boxH = parseInt($('#FlowContextMenu').css('height').split('px')[0]);
     const midMin = window.innerHeight/2 - boxH/2 - boxH/3;
     const midMax = window.innerHeight/2 + boxH/2 - boxH/3;
     if(window.innerHeight - top < boxH + 50){
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
    },
    'Output Signal':{
      inputs:['input'],
      outputs:[],
    },
    'Log Signal':{
      inputs:['input'],
      outputs:[],
    },
    '3D Box':{
      inputs:['position','scale'],
      outputs:[],
    },
    'InputBox':{
      inputs:[],
      outputs:['value'],
    },
    'Slider':{
      inputs:[],
      outputs:['value'],
    },
    'Toggle' : {
      inputs:[],
      outputs:['value'],
    },
    'Button' : {
      inputs:[],
      outputs:['click'],
    },
    'Knob' : {
      inputs:[],
      outputs:['value'],
    },
    'Chart' : {
      inputs:['value'],
      outputs:[],
    },
    'Javascript' : {
      inputs:['input'],
      outputs:['output'],
    },
    'Python' : {
      inputs:['input'],
      outputs:['output'],
    },
    'Join' : {
      inputs:['a','b','c','d'],
      outputs:['value'],
    },
    'Split' : {
      inputs:['value'],
      outputs:['a','b','c','d'],
    },
    'HTML Widget' : {
      inputs:['input'],
      outputs:['output'],
    }
  }
  const createNewNode = (e,type) => {
    addNode(FlowStores,{
      title:type,
      ...config[type],
      x:(e.clientX-layout.x)/layout.z,
      y:(e.clientY-60-layout.y)/layout.z,
    });
    hideContextMenu();
  }

  const deleteExistingNode = (e) => {
    const node = e.find(x => x.includes('FN_node')).split('FN_node_')[1];   
    deleteNode(node,FlowStores);
    hideContextMenu();
  }

  const editNode = (e) => {
    const node = e.find(x => x.includes('FN_node')).split('FN_node_')[1];   
    setPopup({open:true , type:'editNode', node});
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
      deleteNode={deleteExistingNode}
      editNode={editNode}
      ></ContextMenu>
    </div>

  )
}

export default NodeEditor