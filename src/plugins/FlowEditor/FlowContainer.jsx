import { createEffect, children, onMount, createDeferred } from "solid-js";
import "./FlowEditor.css";
import {drawConnections} from './FlowScript';


const FlowContainer = (props) => {
    let viewer;
    const child = children(() => props.children);
    const id = 'FlowEditor-app';
    const [node, setNode] = props.nodeStore;
    // const [nodes, setNodes] = props.nodeList;
    const [connection, setConnection] = props.connectionStore;
    const [connectionList, setConnectionList] = props.connectionList;
    const [layout, setLayout] = props.layoutStore;
    let arrowList = {};

    const startEffects = () => {

        createEffect(()=>{
            if(node.isDragging || connection.isDragging){
                viewer?.pause();
            } else {
                viewer?.resume();
            }
        });   
    };

    const createPanZoomLayout = () => {
        viewer =  panzoom(document.querySelector(`#${id} .viewport`));
        viewer.on("pan", e => {
            const transform = e.getTransform();
            setLayout({
                    x:transform.x,
                    y:transform.y,
                    z:transform.scale
            });

        }).on("zoom", e => {
            const transform = e.getTransform();
            setLayout({
                x:transform.x,
                y:transform.y,
                z:transform.scale
            });
        });
    }

    onMount(async ()=>{
    
        await new Promise(r => setTimeout(r, 50));
        createPanZoomLayout();
        startEffects();
        setLayout({id :id});
        arrowList = drawConnections({
            id,
            connections: connectionList.connections,
            arrowList,
            nodeList:props.nodeList,
            layout
        });
    });

return (
  <div id={id} class="FlowEditor-app" style="width: 100%;height: 100%;">
      <div class="viewport">
            {child()}
            <svg class="connectorSVG"></svg>
      </div>
  </div>

  )

}

export default FlowContainer