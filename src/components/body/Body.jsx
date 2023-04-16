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
import Analytics from "../../screens/analytics/Analytics";
import Scripts from "../../screens/scripts/Scripts";

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

    registerRenderer['Analytics'] = _.once(() =>{
      registerWindow('Analytics' , 'analytics')
    });

    registerRenderer['Scripts'] = _.once(() =>{
      registerWindow('Scripts' , 'scripts')
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
    'analytics',
    'scripts',
    'controls',
  ];

  const components = [
    <Workspace/>,
    <Connections/>,
    <NodeEditor/>,
    <Simulation/>,
    <Analytics/>,
    <Scripts/>,
    <Controls/>,
  ];

  const TabName =     
  ['Workspace',
  'Signals',
  'Blueprint',
  'Simulator',
  'Analytics',
  'Scripts',
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
          <li><span class="label">Workspace</span>- lets you save, export , import your project.</li>
          <li><span class="label">Signals</span>- lets you create signals for communicating with outside world (Output and Input signals).</li>
          <li><span class="label">Blueprint</span>- lets you create your robot workflow using the node editor.</li>
          <li><span class="label">Simulator</span>- lets you see live simulation of your robot before deploying.</li>
          <li><span class="label">Analytics</span>- lets you Analyse the data collected from your robot.</li>
          <li><span class="label">Scripts</span>- lets you add custom javascript logic in blueprint.</li>
          <li><span class="label">Controls</span>- lets you control, record, debug and watch signal logs.</li>
        </ul>
        {/* <div class="break"></div>
        <h2>Get in touch : <span>Nikhil M Jeby</span></h2> */}
      </div>
    </div>
  </>)
}
