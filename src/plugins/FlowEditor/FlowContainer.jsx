import { createEffect, children, onMount } from "solid-js";
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
    const offset = {x:0, y:0};

    const startEffects = () => {

        createEffect(()=>{
            if(node.isDragging || connection.isDragging){
                viewer?.pause();
            } else {
                viewer?.resume();
            }
        });
    
        const getFromXY = (fromNode,fromWidth,fromHeight)=>{
            return {
                x: parseFloat(nodes[fromNode].x)+ layout.x/layout.z+ offset.x + fromWidth +4 ,
                y: parseFloat(nodes[fromNode].y)+ layout.y/layout.z+ offset.y + fromHeight
            }
        }

        const getToXY = (toNode,toHeight) => {
            return {
                x: parseFloat(nodes[toNode].x)+ layout.x/layout.z+ offset.x+4,
                y: parseFloat(nodes[toNode].y)+ layout.y/layout.z+ offset.y + toHeight
            }
        }
        createEffect(()=>{
            if(!node.isDragging)
            {
                console.log('test');
                const view = '#'+id;
                // $(`#${id} .connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
                // $(`#${id} .connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
                connectionList.connections?.forEach(async item => {
                    const [[fromNode, fromPort], [toNode, toPort]] = item;
                    const key = `${fromNode}#${fromPort}#${toNode}#${toPort}`;
                    const fromWidth = parseFloat($(`#${fromNode}`).css('width').split('px')[0]);
                    const fromHeight = 20*fromPort+15;
                    const fromXY = getFromXY(fromNode,fromWidth,fromHeight);
                    const toHeight = 20*toPort+15;
                    const toXY = getToXY(toNode,toHeight);
                    // const fromXY = {x:0, y:0};
                    // const toXY = {x:0,y:0};
                    if(!arrowList[key]){
                        arrowList[key] = {};
                        arrowList[key].arrow = await createArrow({
                            fromNode:'#'+fromNode,
                            toNode: '#'+toNode,
                            fromPort,
                            toPort,
                            fromXY,
                            toXY,
                            view
                        });
                        arrowList[key].prevProps = {fromXY, toXY};
                    } else {
                        // arrowList[key].arrow.update({source:fromXY , destination: toXY});
                    }
                });
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
            });

        }).on("zoom", e => {
            const transform = e.getTransform();
            setLayout({ z:transform.scale });
        });
    }

    const createDraggableNodes = () => {
        // interact('.FlowNode').draggable({
        //     listeners: {
        //       start (event) {
        //         setNode({isDragging:true});
        //       },
        //       move (event) {
        //         const node = nodes[event.target.id];
        //         setNodes(event.target.id , item => ({
        //             ...item,
        //             x: parseFloat(item.x) + event.dx/layout.z,
        //             y: parseFloat(item.y) + event.dy/layout.z
        //         }))
                
        //         event.target.style.transform =`translate(${node.x}px, ${node.y}px)`
        //       },
        //       end(event){
        //         setNode({isDragging:false});
        //       }
        //     }
        //   });

        
    }

    onMount(async ()=>{
    
        await new Promise(r => setTimeout(r, 50));
        createPanZoomLayout();
        createDraggableNodes();
        startEffects();
    });

return (
  <div id={id} class="FlowEditor-app" style="width: 100%;height: 100%;">
      {/* <div class="reset" onClick={()=>viewer.scrollCenter()}></div>
      <div class="guides horizontal"></div>
      <div class="guides vertical"></div>
      <div class="scroll horizontal"></div> */}
      <div class="viewport">
            {child()}
            <svg class="connectorSVG"></svg>
      </div>
  </div>

  )

}

export default FlowContainer