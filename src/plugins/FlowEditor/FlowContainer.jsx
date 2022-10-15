import { createEffect, children, onMount } from "solid-js";
import * as panzoom from "panzoom";
import Guides from "@scena/guides";
import "./FlowEditor.css";
import interact from 'interactjs';

import { nodeStore, connectionStore, layoutStore, nodeList } from "./FlowStore";


const FlowContainer = (props) => {
    let viewer, horizontalGuides, verticalGuides;
    const child = children(() => props.children);
    
    const [node, setNode] = nodeStore;
    const [nodes, setNodes] = nodeList;
    const [connection, setConnection] = connectionStore;
    const [layout, setLayout] = layoutStore;

    createEffect(()=>{
        if(node.isDragging || connection.isDragging){
            viewer?.pause();
        } else {
            viewer?.resume();
        }
    });

    const createGuides = () => {
        horizontalGuides = new Guides(document.querySelector("#FlowEditor-app .guides.horizontal"), {
            snapThreshold: 5,
            snaps: [0, 300, 600],
            displayDragPos: true,
            dragPosFormat: v => `${v}px`,
        }).on("changeGuides", ({ guides }) => {
            moveable.horizontalGuidelines = guides;
        });
        verticalGuides = new Guides(document.querySelector("#FlowEditor-app .guides.vertical"), {
            type: "vertical",
            snapThreshold: 5,
            snaps: [0, 200, 400],
            displayDragPos: true,
            dragPosFormat: v => `${v}px`,
        }).on("changeGuides", ({ guides }) => {
            moveable.verticalGuidelines = guides;
        });
    }

    const createPanZoomLayout = () => {
        viewer =  panzoom(document.querySelector('#FlowEditor-app .viewport'));
        viewer.on("pan", e => {
            const transform = e.getTransform();
            setLayout({
                    x:transform.x,
                    y:transform.y,
            });
            horizontalGuides.scroll(transform.x, transform.scale);
            horizontalGuides.scrollGuides(transform.y, transform.scale);
    
            verticalGuides.scroll(transform.y, transform.scale);
            verticalGuides.scrollGuides(transform.x, transform.scale);
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
            }).observe(document.getElementById('FlowEditor-app'))
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
                    x: item.x + event.dx/layout.z,
                    y: item.y + event.dy/layout.z
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
    });

return (
  <div id="FlowEditor-app" class="FlowEditor-app" style="width: 100%;height: 100%;">
      <div class="reset" onClick={()=>viewer.scrollCenter()}></div>
      <div class="guides horizontal"></div>
      <div class="guides vertical"></div>
      <div class="scroll horizontal"></div>
      <div class="viewport">
            {child()}
      </div>
  </div>

  )

}

export default FlowContainer