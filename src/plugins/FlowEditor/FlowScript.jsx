import * as arrowLine from 'arrow-line';

const createArrow = async ({
    fromNode,
    fromPort,
    toNode,
    toPort,
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
        color: 'blue',
        svgParentSelector: view + ' .connectorSVG' ,
        curvature: 0.3,
        thickness: 2,
        endpoint:{
            type : 'none'
        }
    });
}


export {
    createArrow
}