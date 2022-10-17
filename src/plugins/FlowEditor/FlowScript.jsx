import * as arrowLine_ from 'arrow-line';

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
    return _arrowLine(fromXY, toXY, { 
        color: 'rgb(236,9,202)',
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