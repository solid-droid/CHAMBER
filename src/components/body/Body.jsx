import {  onMount, createEffect } from "solid-js";
import { render } from "solid-js/web";
import _ from 'underscore';
import "./Body.css";

import {openMenu} from '../../scripts/store';
import Workspace from '../../screens/workspace/Workspace'
import Connections from '../../screens/connections/Connections'
import NodeEditor from '../../screens/nodeEditor/NodeEditor'
import Simulation from '../../screens/simulation/Simulation'
import Controls from '../../screens/controls/Controls'
import Debug from '../../screens/debug/Debug'

export const Body = () => {
  const [menu, setMenu] = openMenu;
  let layout, registerRenderer = {};
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


    registerRenderer['Workspace'] = _.once(() =>registerWindow('Workspace' , 'workspace',  <Workspace/>));
    registerRenderer['Connections'] = _.once(() =>registerWindow('Connections' , 'connections',  <Connections/>));
    registerRenderer['Node Editor'] = _.once(() =>registerWindow('Node Editor' , 'nodeEditor',  <NodeEditor/>));
    registerRenderer['Simulator'] = _.once(() =>registerWindow('Simulator' , 'simulator',  <Simulation/>));
 
    registerRenderer['Controls'] = _.once(() =>registerWindow('Controls' , 'controls',  <Controls/>));
    registerRenderer['Debugger'] = _.once(() =>registerWindow('Debugger' , 'debugger',  <Debug/>));

    
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
    'nodeEditor',
    'simulator',
    'controls',
    'debugger'
  ];
    
  onMount(() =>{
    beginLayout();
    ['Workspace',
    'Connections',
    'Node Editor',
    'Simulator',
    'Controls',
    'Debugger'].forEach((name,i) =>
      createEffect(()=>{
      if(menu[menuItems[i]]){
        registerRenderer[name]();
        addWindow(name);
      } else {
        closeWindow(name);
      }
    }))

  });

  return (<div class="body" id="layoutContainer"></div>)
}
