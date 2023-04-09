import {  onMount, createEffect, lazy } from "solid-js";
import { render } from "solid-js/web";
import _ from 'underscore';
import "./Body.css";

import {openMenu} from '../../scripts/store';
import Workspace from '../../screens/workspace/Workspace'
import NodeEditor from '../../screens/nodeEditor/NodeEditor'
import Connections from '../../screens/connections/Connections'
import Simulation from '../../screens/simulation/Simulation'
import Controls from '../../screens/controls/Controls'

export const Body = () => {
  const [menu, setMenu] = openMenu;
  let layout, registerRenderer = {}, openViews = [];
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
    registerRenderer['Signals'] = _.once(() =>{
      registerWindow('Signals' , 'connections')
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
  ];

  const components = [
    <Workspace/>,
    <Connections/>,
    <NodeEditor/>,
    <Simulation/>,
    <Controls/>,
  ];

  const TabName =     
  ['Workspace',
  'Signals',
  'Blueprint',
  'Simulator',
  'Controls'];
    
  onMount(() =>{

    beginLayout();
    TabName.forEach((name,i) =>{
      render(() => components[i], document.getElementById(`screen_${name}`));
      createEffect(()=>{
        if(menu[menuItems[i]]){
          openViews[i]=true;
          $('#startScreen').hide();
          registerRenderer[name]();
          addWindow(name);
        } else {
          openViews[i] = false;
          closeWindow(name);
          if(!openViews.some(x => x)){
            $('#startScreen').show();
          }
        }
      });

  });

  });

  return (
  <>
    <div class="body" id="layoutContainer">
      <div id="startScreen">
        <h1>CHAMBER <span>v0.01 Alpha</span></h1>
        <h3>Robotics Simulation and HMI Platform</h3>
        <div class="break"></div>
        <h2>Getting Started</h2>
        <ul>
          <li><b>Blueprint View</b> lets you create your robot workflow using the node editor.</li>
          <li><b>Simulator View</b> lets you see live simulation of your robot before deploying.</li>
          <li><b>Controls View</b> lets you control, record, debug and watch signal logs.</li>
          <li><b>Signals View</b> lets you create signals for communicating with outside world (Output and Input signals).</li>
          <li><b>Scripts View</b> lets you add custom javascript logic in blueprint.</li>
          <li><b>Analytics View</b> lets you Analyse the data collected from your robot.</li>
          <li><b>Workspace View</b> lets you save, export , import your project.</li>
          <li><b>Market View</b> lets you import community created blueprints to your project.</li>
        </ul>
        <div class="break"></div>
        <h2>Why Chamber ?</h2>
        <ul>
          <li>CHAMBER as a platform helps you easily simulate robot workflows before buying robot hardware.</li>
        </ul>
        {/* <div class="break"></div>
        <h2>Get in touch : <span>Nikhil M Jeby</span></h2> */}
      </div>
    </div>
  </>)
}
