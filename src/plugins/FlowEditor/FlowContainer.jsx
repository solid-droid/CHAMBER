import { createEffect, children, onMount,  on, untrack } from "solid-js";
import "./FlowEditor.css";
import {drawConnections, getPropertiesForArrow} from './FlowScript';
import _ from "underscore";

const FlowContainer = (props) => {
    let viewer;
    const child = children(() => props.children);
    const id = 'FlowEditor-app';
    const [node, setNode] = props.nodeStore;
    const [nodes, setNodes] = props.nodeList;
    const [connection, setConnection] = props.connectionStore;
    const [connectionList, setConnectionList] = props.connectionList;
    const [layout, setLayout] = props.layoutStore;
    let arrowList = {};

    const refreshSVG = _.debounce(()=>{
        $(`#${layout.id} .connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
        $(`#${layout.id} .connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
        createArrows();
    }, 200)
    const startEffects = () => {

        createEffect(()=>{
            if(node.isDragging || connection.isDragging){
                viewer?.pause();
            } else {
                viewer?.resume();
            }
        });   

        createEffect(()=>{
            const dConn = connection.deletedConnection;
            untrack(() => {
                Object.keys(arrowList).forEach(key => {
                   const [fromNode, fromPor, toNode, toPort] = key.split('#');
                   if(dConn.toNode == toNode && dConn.toPort == toPort){
                        arrowList[key].remove();
                        delete arrowList[key];
                   }
                });
            });
        })

        createEffect(on(connectionList, () => {
                createArrows();
        }));
    }
    
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
        }).on("transform", e=>{
            refreshSVG();
        });
    }

    const createArrows = () => {
        arrowList = drawConnections({
            id,
            connections: connectionList(),
            arrowList,
            nodeList:props.nodeList,
            layout
        });
    }

    onMount(async ()=>{
    
        await new Promise(r => setTimeout(r, 50));
        createPanZoomLayout();
        startEffects();
        setLayout({id :id});
        $(window).mouseup(()=> {
            setNode({isDragging:false});
            setConnection({isDragging:false});
        })
        
    });

return (
  <div id={id} class="FlowEditor-app" style="width: 100%;height: 100%;">
      <div class="viewport">
            {child()}
            <svg class="connectorSVG"></svg>
            <div class="connectionGhost"></div>
            <svg class="ghostSVG"></svg>
      </div>

  </div>

  )

}

export default FlowContainer