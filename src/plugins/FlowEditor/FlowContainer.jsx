import { createEffect, children, onMount } from "solid-js";
import Guides from "@scena/guides";
import "./FlowEditor.css";
import interact from 'interactjs';
import {createArrow} from './FlowScript';

const FlowContainer = (props) => {
    let viewer, horizontalGuides, verticalGuides;
    const child = children(() => props.children);
    const id = 'FlowEditor-app';
    const [node, setNode] = props.nodeStore;
    const [nodes, setNodes] = props.nodeList;
    const [connection, setConnection] = props.connectionStore;
    const [connectionList, setConnectionList] = props.connectionList;
    const [layout, setLayout] = props.layoutStore;
    const arrowList = {};
    const offset = {x:30, y:30};

    const startEffects = () => {

        createEffect(()=>{
            if(node.isDragging || connection.isDragging){
                viewer?.pause();
            } else {
                viewer?.resume();
            }
        });
    
        createEffect(()=>{
            const view = '#'+id;
            $(`#${id} .connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
            $(`#${id} .connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
            connectionList.connections?.forEach(async item => {
                const [[fromNode, fromPort], [toNode, toPort]] = item;
                const key = `${fromNode}#${fromPort}#${toNode}#${toPort}`;
                const fromWidth = parseFloat($(`#${fromNode}`).css('width').split('px')[0]);
                const fromHeight = 20*fromPort+15;
                const fromXY = {
                    x: parseFloat(nodes[fromNode].x)+ layout.x/layout.z+ offset.x + fromWidth +4 ,
                    y: parseFloat(nodes[fromNode].y)+ layout.y/layout.z+ offset.y + fromHeight
                }

                const toHeight = 20*toPort+15;
                const toXY = {
                    x: parseFloat(nodes[toNode].x)+ layout.x/layout.z+ offset.x+4,
                    y: parseFloat(nodes[toNode].y)+ layout.y/layout.z+ offset.y + toHeight
                }
                if(!arrowList[key]){
                    arrowList[key] = await createArrow({
                        fromNode:'#'+fromNode,
                        toNode: '#'+toNode,
                        fromPort,
                        toPort,
                        fromXY,
                        toXY,
                        view
                    });
                } else {
                    arrowList[key].update({source:fromXY , destination: toXY});
                }
            });
        });
    
    };

    const createGuides = () => {
        horizontalGuides = new Guides(document.querySelector(`#${id} .guides.horizontal`), {
            // snapThreshold: 5,
            // snaps: [0, 300, 600],
            displayDragPos: true,
            dragPosFormat: v => `${v}px`,
        }).on("changeGuides", ({ guides }) => {
            moveable.horizontalGuidelines = guides;
        });
        verticalGuides = new Guides(document.querySelector(`#${id} .guides.vertical`), {
            type: "vertical",
            // snapThreshold: 5,
            // snaps: [0, 200, 400],
            displayDragPos: true,
            dragPosFormat: v => `${v}px`,
        }).on("changeGuides", ({ guides }) => {
            moveable.verticalGuidelines = guides;
        });
    }

    const createPanZoomLayout = () => {
        viewer =  panzoom(document.querySelector(`#${id} .viewport`));
        viewer.on("pan", e => {
            const transform = e.getTransform();
            setLayout({
                    x:transform.x,
                    y:transform.y,
            });

            horizontalGuides.scroll(-transform.x/transform.scale);    
            verticalGuides.scroll(-transform.y/transform.scale);

        }).on("zoom", e => {
            const transform = e.getTransform();
            setLayout({ z:transform.scale });
            verticalGuides.zoom = transform.scale;
            horizontalGuides.zoom = transform.scale;
        });
    }

    const resizeObs = () => {
        new ResizeObserver(() => {
            horizontalGuides.resize();
            verticalGuides.resize();
            }).observe(document.getElementById(id))
    }

    const createDraggableNodes = () => {
        interact('.FlowNode').draggable({
            listeners: {
              start (event) {
                setNode({isDragging:true});
              },
              move (event) {
                const node = nodes[event.target.id];
                setNodes(event.target.id , item => ({
                    ...item,
                    x: parseInt(item.x) + event.dx/layout.z,
                    y: parseInt(item.y) + event.dy/layout.z
                }))
                
                event.target.style.transform =`translate(${node.x}px, ${node.y}px)`
              },
              end(event){
                setNode({isDragging:false});
              }
            }
          });
    }

    onMount(async ()=>{
    
        await new Promise(r => setTimeout(r, 50));
        createGuides();
        createPanZoomLayout();
        resizeObs();
        createDraggableNodes();
        startEffects();
    });

return (
  <div id={id} class="FlowEditor-app" style="width: 100%;height: 100%;">
      <div class="reset" onClick={()=>viewer.scrollCenter()}></div>
      <div class="guides horizontal"></div>
      <div class="guides vertical"></div>
      <div class="scroll horizontal"></div>
      <div class="viewport">
            {child()}
            <svg class="connectorSVG"></svg>
      </div>
  </div>

  )

}

export default FlowContainer