import { createEffect, onMount } from 'solid-js';
import {openMenu} from '../../scripts/store';

function GraphEditor() {
  const [menu] = openMenu;
  let graph;
  let graphCanvas;
  let editor;
 
  createEffect(async ()=>{
    if(menu.graphEditor){
        await new Promise(r => setTimeout(r, 50))
        graphCanvas.setCanvas('graphCanvas');
        graphCanvas.resize();
    }    
  })

  onMount(() => {
    graph = new LGraph();
    graphCanvas = new LGraphCanvas("#graphCanvas", graph ,{ 
      autoresize : true
     });
    editor = new Editor(graphCanvas, graph);

    let node_const = LiteGraph.createNode("basic/const");
    node_const.pos = [200,200];
    graph.add(node_const);
    node_const.setValue(4.5);
    
    let node_watch = LiteGraph.createNode("basic/watch");
    node_watch.pos = [700,200];
    graph.add(node_watch);
    
    node_const.connect(0, node_watch, 0 );
    
    // main
    graph.start()
    
    
  })

  return (
      <canvas id='graphCanvas'/>
  )
}

export default GraphEditor