import arrowLine from 'arrow-line';
import { produce } from "solid-js/store";
import {windowData} from "../../scripts/store";

const createArrow = async ({
    fromNode,
    toNode,
    fromXY,
    toXY,
    view
}) => {
    while(
        !$(fromNode).length || 
        !$(toNode).length){
        await new Promise(r => setTimeout(r, 100));
    }
    return createArrowLine(fromXY,toXY,view);
}

const createArrowLine = (fromXY, toXY, view , container='connectorSVG') => {
    return arrowLine(fromXY, toXY, { 
        color: '#4f92a7',
        svgParentSelector: view +'_'+ container ,
        // curvature: 0.3,
        thickness: 2,
        pivots:[{x:20, y: 0}, {x:-15, y: 0}],
        endpoint:{
            type : 'none'
        }
    });
}

const getFromXY = (fromNode,fromPort,layout,nodes)=>{
    const fromWidth = parseFloat($(`#${fromNode}`).css('width').split('px')[0]);
    const fromHeight = 20*fromPort+15;
    return {
        x: parseFloat(nodes[fromNode].x)+ layout.x/layout.z+ fromWidth +5 ,
        y: parseFloat(nodes[fromNode].y)+ layout.y/layout.z+ fromHeight+2
    }
}

const getToXY = (toNode,toPort,layout,nodes) => {
    const toHeight = 20*toPort+15;
    return {
        x: parseFloat(nodes[toNode].x)+ layout.x/layout.z + 1,
        y: parseFloat(nodes[toNode].y)+ layout.y/layout.z+ toHeight + 3
    }
}

const getPropertiesForArrow = ({
    fromNode,
    fromPort,
    toNode,
    toPort,
    layout,
    nodeObj
}) => {
    const fromXY = getFromXY(fromNode,fromPort,layout,nodeObj);
    const toXY = getToXY(toNode,toPort,layout,nodeObj);
    return{
        fromXY,
        toXY
    }
}

const drawConnections = ({
    id,
    layout,
    connections,
    arrowList,
    nodeObj
}) => {
    if(layout){
        const view = '#'+id;
        const [nodes, setNodes] = nodeObj;
        //create new + update existing
        if(purityCheck(nodes,connections)){
            connections?.forEach(async item => {
                const [[fromNode, fromPort], [toNode, toPort]] = item;
                const key = `${fromNode}#${fromPort}#${toNode}#${toPort}`;
                const {fromXY,toXY} = getPropertiesForArrow({
                    fromNode,
                    fromPort,
                    toNode,
                    toPort,
                    layout,
                    nodeObj:nodes
                })
                if(!arrowList[key]){
                    arrowList[key] = await createArrow({
                        fromNode:'#'+fromNode,
                        toNode: '#'+toNode,
                        fromXY,
                        toXY,
                        view
                    });
                    setNodes(fromNode , item => {
                        const connections =item.connections || [];
                        connections.push({
                            fromNode,
                            toNode,
                            fromPort,
                            toPort,
                            key,
                            arrow:arrowList[key]
                        });
                        
                        return {
                            ...item,
                            connections
                        }
                    });
                    setNodes(toNode , item => {
                        const connections =item.connections || [];
                        connections.push({
                            fromNode,
                            toNode,
                            fromPort,
                            toPort,
                            key,
                            arrow:arrowList[key]
                        });
                        
                        return {
                            ...item,
                            connections
                        }
                    });
                } else {
                    arrowList[key].update({source:fromXY , destination: toXY});
                } 
            });
        }

    }

    return arrowList;
}


const purityCheck = (nodeObj, connectionList) => {
    let _connNodes = new Set();
    let allow = true;
    connectionList.forEach(item => {
        item.forEach(nodes => {
            _connNodes.add(nodes[0])
        })
    })
    _connNodes = [..._connNodes];
    _connNodes.forEach(item => {
        if(allow && !nodeObj[item]){
            allow = false;
        }
    });
    return allow;
}

const deleteNode = (node, FlowStores) => {
    const [nodeList , setNodeList] = FlowStores.nodeList;
    const [nodeObj , setNodeObj] = FlowStores.nodeObj;
    const [connectionList , setConnectionList] = FlowStores.connectionList;
    setConnectionList(_conn => {
        _conn = _conn.filter(con => !(con[0][0]==node || con[1][0] ==node) );
        return _conn;
      })
  
    setNodeObj(produce(_nodes => {
        _nodes[node].connections?.forEach(con => {
          try{
            con.arrow.remove();
          } catch(e){}
          const from = con.fromNode == node ? true : false;
          const _connList = _nodes[from ? con.toNode : con.fromNode].connections.filter(c => {
                  if(from && c.fromNode == node){
                    delete FlowStores.arrowList[con.key];
                    return false
                  } else if(c.toNode == node){
                    delete FlowStores.arrowList[con.key];
                    return false
                  }
                  return true
                });
          _nodes[from ? con.toNode : con.fromNode].connections = _connList;
        //   setNodeObj(from ? con.toNode : con.fromNode, _node => ({..._node,connections:_connList }));
        });
        _nodes[node].widget.destroy();
        delete _nodes[node];
    }));

    setNodeList(_nodes => {
        return _nodes.filter(_node => _node.id !== node);
    });
}

const addNode = (FlowStores, nodeConfig) => {
    const [nodeList , setNodeList] = FlowStores.nodeList;
    const [nodeStore, setNodeStore] = FlowStores.nodeStore;
    setNodeList(_nodes => [{
        id:`node${nodeStore.nodeCounter}`,
        ...nodeConfig
      },..._nodes]);
    
    setNodeStore({nodeCounter: nodeStore.nodeCounter+1});
}

const updateNode = (FlowStores, id, nodeConfig) => {
    const [nodeList , setNodeList] = FlowStores.nodeList;
    setNodeList(_node => {
        const k = _node.find(i => i.id == id)
        Object.keys(nodeConfig).forEach(x => {
            k[x] = nodeConfig[x]
        });
        return _node;
      });
    
}

const getNode = (node, FlowStores) => {
    const [nodeList , setNodeList] = FlowStores.nodeList;
    return nodeList().find(x => x.id == node);
}

const clearFlowEditor = (FlowStores = windowData[0].flowEditor) => {
    const [nodeList , setNodeList] = FlowStores.nodeList;
    const [connectionList, setConnectionList] = FlowStores.connectionList;
    const [nodeStore , setNodeStore] = FlowStores.nodeStore;
    const [nodeObj , setNodeObj] = FlowStores.nodeObj;
    const [connectionStore, setConnectionStore] = FlowStores.connectionStore;
    const [layout, setLayout] = FlowStores.layoutStore;
    Object.keys(FlowStores.arrowList).forEach(key => {
        FlowStores.arrowList[key].remove();
        delete FlowStores.arrowList[key];
    });
    setNodeObj(produce(nodes => {
        Object.entries(nodes).forEach(([nodeID,node]) =>{
            try{
                node.widget.destroy();
            } catch(e){}
            delete nodes[nodeID];
        });
    }));
    setNodeList([]);
    setConnectionList([]);
    setNodeStore({
        selectedNode: null,
        isDragging: false,
        nodeCounter:0
    });

    setConnectionStore({
        selectedConnection: null,
        isDragging : false,
        deletedConnecion:null,
        arrow:null,
        fromXY:null
    });
    setLayout({
        ready:false,
        x:0,
        y:0,
        z:1
    });
};


const rescaleSVG = () => {
    const id = 'FlowEditor-app';
    const FlowStores = windowData[0].flowEditor
    const [layout, setLayout] = FlowStores.layoutStore;
    $(`#${id}_connectorSVG`).css({top:-layout.y/layout.z, left:-layout.x/layout.z});
    $(`#${id}_connectorSVG`).css({width:`${100/layout.z}vw`, height: `${100/layout.z}vh`});
}


export {
    createArrow,
    drawConnections,
    getPropertiesForArrow,
    getFromXY,
    getToXY,
    createArrowLine,
    purityCheck,
    clearFlowEditor,
    addNode,
    deleteNode,
    updateNode,
    getNode,
    rescaleSVG
}