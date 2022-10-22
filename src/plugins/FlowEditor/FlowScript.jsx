import arrowLine from 'arrow-line';

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

const createArrowLine = (fromXY, toXY, view , container='.connectorSVG') => {
    return arrowLine(fromXY, toXY, { 
        color: '#4f92a7',
        svgParentSelector: view +' '+ container ,
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
    nodes
}) => {
    const fromXY = getFromXY(fromNode,fromPort,layout,nodes);
    const toXY = getToXY(toNode,toPort,layout,nodes);
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
    nodeList
}) => {
    if(layout){
        const view = '#'+id;
        const [nodes, setNodes] = nodeList;
        //create new + update existing
        connections?.forEach(async item => {
            const [[fromNode, fromPort], [toNode, toPort]] = item;
            const key = `${fromNode}#${fromPort}#${toNode}#${toPort}`;
            const {fromXY,toXY} = getPropertiesForArrow({
                fromNode,
                fromPort,
                toNode,
                toPort,
                layout,
                nodes
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

    return arrowList;
}


export {
    createArrow,
    drawConnections,
    getPropertiesForArrow,
    getFromXY,
    getToXY,
    createArrowLine
}