import {createStore} from "solid-js/store"
import {createFlowStores} from "../plugins/FlowEditor/FlowEditor";
const openMenu = createStore({
    workspace : false,
    connections : false,
    nodeEditor : false,
    simulator: false,
    analytics:false,
    market:false,
    controls: false,
  });

const windowData = createStore({
  flowEditor:createFlowStores()
});

const popupData = createStore({
  open:false,
  type:null,
  node:null,
})

const masterFile = {};

export {
    openMenu,
    windowData,
    masterFile,
    popupData
}