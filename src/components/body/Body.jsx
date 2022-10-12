import {  onMount, createEffect } from "solid-js";
import { render } from "solid-js/web";
import "./Body.css"
import {openMenu} from '../../scripts/store';
import Workspace from '../../screens/workspace/Workspace'
import Connections from '../../screens/connections/Connections'
import GraphEditor from '../../screens/graphEditor/GraphEditor'
import Simulation from '../../screens/simulation/Simulation'

import Controls from '../../screens/controls/Controls'
import Debug from '../../screens/debug/Debug'
// screens
export const Body = () => {
  const [menu, setMenu] = openMenu;
  let layout;
  ///////////////////////
  function beginLayout(){
    const config = {
      settings:{
        showPopoutIcon: false,
      },
      content:[]
    };
    layout = new GoldenLayout( config, $('#layoutContainer') );

    $(window).resize( () => {
      layout.updateSize($(window).width(), $(window).height()-26);
    });


    registerWindow('Workspace' , 'workspace',  <Workspace/>);
    registerWindow('Connections' , 'connections',  <Connections/>);
    registerWindow('Graph Editor' , 'graphEditor',  <GraphEditor/>);
    registerWindow('Simulator' , 'simulator',  <Simulation/>);
 
    registerWindow('Controls' , 'controls',  <Controls/>);
    registerWindow('Debugger' , 'debugger',  <Debug/>);

    
    layout.init();
  }

  const registerWindow = (name, menuName , element) => {
    layout.registerComponent( name , function( container, state ){
      render(() => element, container.getElement()[0]);
      container.on('destroy', async () => {
        await new Promise(r => setTimeout(r, 50));
        setMenu({[menuName]:false});
      });
    });
  }

  const addWindow = name => {
    const root = layout?.root.contentItems[ 0 ] || layout?.root;
    root?.addChild( {
      type: 'component',
      componentName: name,
      componentState: {  }
    });
  }

  const closeWindow = name => {
    layout?._getAllContentItems().find(x => x.componentName === name)?.close();
  }

  const menuItems = [
    'workspace',
    'connections',
    'graphEditor',
    'simulator',
    'controls',
    'debugger'
  ];
  
  ['Workspace',
  'Connections',
  'Graph Editor',
  'Simulator',
  'Controls',
  'Debugger'].forEach((name,i) =>
    createEffect(()=>{
    if(menu[menuItems[i]]){
      addWindow(name);
    } else {
      closeWindow(name);
    }
  }))

    
  onMount(() =>{
    beginLayout();

  });

  return (<div class="body" id="layoutContainer"></div>)
}
