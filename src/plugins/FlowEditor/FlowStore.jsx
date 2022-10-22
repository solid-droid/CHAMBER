import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

const createFlowStores = () => {
    const nodeStore = createStore({
      selectedNode: null,
      isDragging: false,
    });
    
    const connectionStore = createStore({
      selectedConnection: null,
      isDragging : false,
      deletedConnecion:null
    });
  
    const nodeList = createStore({ 
      length: 0
    });

    const connectionList = createSignal([]);
  
    const layoutStore = createStore({
      ready:false,
      x:0,
      y:0,
      z:1
    });

    return {
      nodeStore,
      connectionStore,
      layoutStore,
      nodeList,
      connectionList
    }
}

export default createFlowStores;