import {createStore} from "solid-js/store"
import {createFlowStores} from "../plugins/FlowEditor/FlowEditor";
const openMenu = createStore({
    workspace : false,
    connections : false,
    nodeEditor : false,
    simulator: false,
    analytics:false,
    controls: false,
    debugger : false
  });

const windowData = createStore({
  flowEditor:createFlowStores()
})

export {
    openMenu,
    windowData
}