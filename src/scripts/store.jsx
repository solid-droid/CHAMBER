import {createStore} from "solid-js/store"

const openMenu = createStore({
    workspace : false,
    connections : false,
    graphEditor : false,
    simulator: false,
    controls: false,
    debugger : false
  })

export {
    openMenu
}