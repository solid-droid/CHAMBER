import { createEffect, onMount, untrack } from "solid-js";
import "./FlowEditor.css";
import {drawConnections} from './FlowScript';
import FlowNode from './FlowNode';
import _ from "underscore";

const FlowContainer = (props) => {
    const id = props.id;
    const [node, setNode] = props.FlowStores.nodeStore;
    const [nodeObj, setNodeObj] = props.FlowStores.nodeObj;
    const [connection, setConnection] = props.FlowStores.connectionStore;
    const [connectionList] = props.FlowStores.connectionList;
    const [nodeList] = props.FlowStores.nodeList;
    const [layout, setLayout] = props.FlowStores.layoutStore;
    let arrowList = props.FlowStores.arrowList;
    let viewport;

    const refreshSVG = _.debounce(()=>{
        $(`#${id}_connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
        $(`#${id}_connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
        createArrows();
    }, 200)

    const startEffects = () => {

        createEffect(()=>{
            if(node.isDragging || connection.isDragging){
                layout?.viewer?.pause();
            } else {
                layout?.viewer?.resume();
            }
        });   

        createEffect(()=>{
            const dConn = connection.deletedConnection;
            if(dConn){
                untrack(() => {
                    Object.keys(arrowList).forEach(key => {
                       const [fromNode, fromPort, toNode, toPort] = key.split('#');
                       if(dConn.toNode == toNode && dConn.toPort == toPort){
                            arrowList[key].remove();
                            delete arrowList[key];
                       }
                    });
                });
            }
        })

        createEffect(() =>{
            connectionList();
            untrack(() => createArrows());  
        });

        createEffect(() => {
            const _nodes = nodeList();
            untrack(() => {
                const keys = Object.keys(nodeObj);
                //add node to nodeTracker
                _nodes.forEach(node => {
                    if(!keys.includes(node.id)){
                        setNodeObj(node.id,node);
                    }
                });
            });
        });
    }
    
    const createPanZoomLayout = () => {
        const viewer =  panzoom(document.querySelector(`#${id} .viewport`));
        setLayout({viewer});
        layout.viewer.on("pan", e => {
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
            nodeObj:props.FlowStores.nodeObj,
            layout
        });
    }

    startEffects();

    onMount(async ()=>{
        await new Promise(r => setTimeout(r, 50));
        createPanZoomLayout();
        setLayout({id :id});

        $(window).on('mouseup.FlowContainerEvent', ()=> {
            setNode({isDragging:false});
            setConnection({isDragging:false});
        });
        
    });

return (
  <div id={id} ref={viewport} class="FlowEditor-app" style="width: 100%;height: 100%;">
      <div class="viewport">
            <For each={nodeList()}>
            {item => 
                <FlowNode 
                id={item.id} 
                inputs={item.inputs}
                outputs={item.outputs} 
                x={item.x}
                y={item.y}
                {...props.FlowStores}>
                    {item.content}
                </FlowNode>
            }
            </For>
            <div class="connectionGhost"></div>
            <svg id={`${id}_connectorSVG`} class="connectorSVG"></svg>
            <svg id={`${id}_ghostSVG`} class="ghostSVG"></svg>
      </div>

  </div>

  )

}

export default FlowContainer