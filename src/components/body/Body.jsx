import {  onMount, createEffect, lazy } from "solid-js";
import { render } from "solid-js/web";
import { windowDispose} from '../../scripts/store';
import _ from 'underscore';
import "./Body.css";

import {openMenu} from '../../scripts/store';
import Workspace from '../../screens/workspace/Workspace'
import NodeEditor from '../../screens/NodeEditor/NodeEditor'
import Connections from '../../screens/connections/Connections'
import Simulation from '../../screens/simulation/Simulation'
import Controls from '../../screens/controls/Controls'
import Debug from '../../screens/debug/Debug'

export const Body = () => {
  const [menu, setMenu] = openMenu;
  const [dispose , setDispose] = windowDispose;
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


    registerRenderer['Workspace'] = _.once(() =>
    {
      registerWindow('Workspace' , 'workspace');
    });
    registerRenderer['Connections'] = _.once(() =>{
      registerWindow('Connections' , 'connections')
    });
    registerRenderer['Blueprint'] = _.once(() =>{
      registerWindow('Blueprint' , 'nodeEditor')
    });
    registerRenderer['Simulator'] = _.once(() =>{
      registerWindow('Simulator' , 'simulator')
    });
    registerRenderer['Controls'] = _.once(() =>{
      registerWindow('Controls' , 'controls')
    });
    registerRenderer['Debugger'] = _.once(() =>{
      registerWindow('Debugger' , 'debugger')
    });

    layout.on( 'stackCreated', function( stack ){
      stack
        .header
        .controlsContainer
        .find( '.lm_close' )
        .off( 'click' ) 
        .click(e => {
          Array.from(e.target.parentElement.previousSibling.children).forEach(child=>{
            $(`#screen_${child.innerText}`).detach().appendTo($('body'));
          });
            stack.remove();
        });
    });
    
    layout.on( 'tabCreated',  tab => {
      tab.closeElement.off( 'click' ) 
        .click(e => {
          $(`#screen_${e.target.previousElementSibling.innerText}`).detach().appendTo($('body'));
          tab.contentItem.remove();
        });
    });
    
    layout.init();
  }

  const registerWindow = (name, menuName , element) => {
    layout.registerComponent( name , function( container, state ){
      $(`#screen_${name}`).detach().appendTo(container.getElement()[0]);     
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
    $(`#screen_${name}`).detach().appendTo($('body'));
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

  const components = [
    <Workspace/>,
    <Connections/>,
    <NodeEditor/>,
    <Simulation/>,
    <Controls/>,
    <Debug/>
  ];

  const TabName =     
  ['Workspace',
  'Connections',
  'Blueprint',
  'Simulator',
  'Controls',
  'Debugger'];
    
  onMount(() =>{

    beginLayout();
    TabName.forEach((name,i) =>{
      render(() => components[i], document.getElementById(`screen_${name}`));
      createEffect(()=>{
        if(menu[menuItems[i]]){
          registerRenderer[name]();
          addWindow(name);
        } else {
          closeWindow(name);
        }
      });

  });

  });

  return (
  <>
  <div class="body" id="layoutContainer"></div>
  </>)
}
