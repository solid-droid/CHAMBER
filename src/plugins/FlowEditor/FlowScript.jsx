import arrowCreate, { DIRECTION } from 'arrows-svg';

const createArrow = async (from, to, view) => {
    while(
        !document.querySelector(from) || 
        !document.querySelector(to)){
        await new Promise(r => setTimeout(r, 100));
    }
    const _from = document.querySelector(from);
    const _to =  document.querySelector(to);
    const _view = document.querySelector(view);
    const arrow = arrowCreate({
        from: {
         node: _from,
        //  direction: DIRECTION.RIGHT
        },
        to: {
         node: _to,
        //  direction: DIRECTION.LEFT
        }
      });
    _view.appendChild(arrow.node);
    return arrow;
}


export {
    createArrow
}