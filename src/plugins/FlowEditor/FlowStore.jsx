import { createSignal } from "solid-js";
import { createStore, createMutable } from "solid-js/store";

const createFlowStores = () => {
    const nodeStore = createStore({
      selectedNode: null,
      editedNode:null,
      executeNode:null,
      isDragging: false,
      nodeCounter:0
    });
    
    const connectionStore = createStore({
      selectedConnection: null,
      isDragging : false,
      deletedConnecion:null,
      arrow:null,
      fromXY:null
    });
  
    const nodeObj = createStore({ });
    const nodeList = createSignal([]);
    const connectionList = createSignal([]);
  
    const layoutStore = createStore({
      ready:false,
      x:0,
      y:0,
      z:1
    });

    const arrowList = createMutable({});

    return {
      nodeStore,
      connectionStore,
      layoutStore,
      nodeObj,
      nodeList,
      connectionList,
      arrowList
    }
}

export default createFlowStores;