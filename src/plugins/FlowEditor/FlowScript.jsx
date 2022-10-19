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
    return arrowLine(fromXY, toXY, { 
        color: '#4f92a7',
        svgParentSelector: view + ' .connectorSVG' ,
        curvature: 0.3,
        thickness: 2,
        endpoint:{
            type : 'none'
        }
    });
}

const getFromXY = (fromNode,fromWidth,fromHeight,layout)=>{
    return {
        x: parseFloat(fromNode.x)+ layout.x/layout.z+ fromWidth +5 ,
        y: parseFloat(fromNode.y)+ layout.y/layout.z+ fromHeight
    }
}

const getToXY = (toNode,toHeight,layout) => {
    return {
        x: parseFloat(toNode.x)+ layout.x/layout.z + 1,
        y: parseFloat(toNode.y)+ layout.y/layout.z+ toHeight
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
    const fromWidth = parseFloat($(`#${fromNode}`).css('width').split('px')[0]);
    const fromHeight = 20*fromPort+15;
    const fromXY = getFromXY(nodes[fromNode],fromWidth,fromHeight,layout);
    const toHeight = 20*toPort+15;
    const toXY = getToXY(nodes[toNode],toHeight,layout);
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
    getPropertiesForArrow
}