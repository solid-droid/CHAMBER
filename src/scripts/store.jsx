import {createStore} from "solid-js/store"

const openMenu = createStore({
    workspace : false,
    connections : false,
    nodeEditor : false,
    simulator: false,
    analytics:false,
    controls: true,
    debugger : false
  })

export {
    openMenu
}