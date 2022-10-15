import { createStore } from "solid-js/store";

const nodeStore = createStore({
    selectedNode: null,
    isDragging: false,
  });
  
  const connectionStore = createStore({
    selectedConnection: null,
    isDragging : false
  })

  const nodeList = createStore({ 
    length:0
  });

  const connectionList = createStore({ 
    length:0
  });

  const layoutStore = createStore({
    ready:false,
    x:0,
    y:0,
    z:1
  })

  export {
    nodeStore,
    connectionStore,
    layoutStore,
    nodeList,
    connectionList
  }