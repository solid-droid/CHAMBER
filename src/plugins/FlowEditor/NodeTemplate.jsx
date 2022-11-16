import { createSignal, createEffect, onMount } from "solid-js";

const inputBox = (nodeList,node,popup,updateNode,id,FlowStores,layout) => {
    const [inpType , setType] = createSignal('number');
    const [inpVal , setVal] = createSignal(0);
    createEffect(()=>{
      if(!popup.open && node.editedNode === id){
        const dat = nodeList().find(x => x.id == id);
        setType(dat.type);
        setVal(dat.value);
      }
    })
    onMount(()=>{
        const dat = nodeList().find(x => x.id == id);
        setType(dat.type);
        setVal(dat.value);
    });
    const updateValue = e => {
      layout?.viewer?.pause()
      updateNode(FlowStores, id, {value:e.target.value})
    }
    return <div class="nodeContNoDrag NodeContent" style="margin-right:5px; margin-bottom:5px;">
              <input type={inpType()} value={inpVal()} 
                     onChange={e => updateValue(e)}
                     onBlur={() => layout?.viewer?.resume()}
              />
          </div>
  }

  const inputSignal = (nodeList,node,popup,id) => {
    const [inpVal , setVal] = createSignal(undefined);
    createEffect(()=>{
      if(!popup.open && node.editedNode === id){
        const dat = nodeList().find(x => x.id == id);
        setVal(dat.name);
      }
    })

    onMount(()=>{
        const dat = nodeList().find(x => x.id == id);
        setVal(dat.name);
    });

    return <div class="NodeContent" style="margin-right:5px; margin-bottom:5px;">
      <input type='text' value={inpVal()} disabled/>
    </div>
  }

  export {
    inputBox,
    inputSignal
  }