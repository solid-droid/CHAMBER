import { createSignal, createEffect, onMount } from "solid-js";
import Dropdown from "../Dropdown/Dropdown";

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

  const signal = (nodeList,node,popup,id) => {
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

    return <div class="NodeContent" style="margin:5px; margin-top:0;">
      <input type='text' value={inpVal()} disabled/>
    </div>
  }

  const slider = (nodeList,node,popup,updateNode,id,FlowStores,layout) => {
    const [inpMin , setMin] = createSignal(0);
    const [inpStep , setStep] = createSignal(1);
    const [inpMax , setMax] = createSignal(100);
    const [inpVal , setVal] = createSignal(0);
    createEffect(()=>{
      if(!popup.open && node.editedNode === id){
        const dat = nodeList().find(x => x.id == id);
        setMin(dat.min);
        setMax(dat.max);
        setStep(dat.step);
        setVal(dat.value);
      }
    })
    onMount(()=>{
        const dat = nodeList().find(x => x.id == id);
        setMin(dat.min);
        setMax(dat.max);
        setStep(dat.step);
        setVal(dat.value);
    });
    const updateValue = e => {
      layout?.viewer?.pause()
      updateNode(FlowStores, id, {value:e.target.value})
    }
    return <div class="nodeContNoDrag NodeContent sliderNode" style="margin-right:5px; margin-bottom:5px;">
              <input type='range' min={inpMin()} max={inpMax()} value={inpVal()} step={inpStep()}
                     onChange={e => updateValue(e)}
                     oninput = {e => setVal(e.target.value)}
                     onBlur={() => layout?.viewer?.resume()}
              />
              <div class="sliderDisplayValue">{inpVal()}</div>
          </div>
  }

  const toggle = (nodeList,node,popup,updateNode,id,FlowStores,layout) => {
    let inputBox;
    createEffect(()=>{
      if(!popup.open && node.editedNode === id){
        const dat = nodeList().find(x => x.id == id);
        inputBox.checked = dat.value;
      }
    })
    onMount(()=>{
        const dat = nodeList().find(x => x.id == id);
        inputBox.checked = dat.value;
    });
    const updateValue = e => {
      layout?.viewer?.pause()
      updateNode(FlowStores, id, {value:e.target.checked})
    }
    return <div class="nodeContNoDrag NodeContent checkboxNode">
              <input type="checkbox" ref={inputBox}
                     onChange={e => updateValue(e)}
                     onBlur={() => layout?.viewer?.resume()}
              />
          </div>
  }

  const javascript = (nodeList,node,popup,updateNode,id,FlowStores,layout) => {
    const [inpVal , setVal] = createSignal(undefined);
    createEffect(()=>{
      if(!popup.open && node.editedNode === id){
        const dat = nodeList().find(x => x.id == id);
        setVal(dat.value);
      }
    })
    onMount(()=>{
        const dat = nodeList().find(x => x.id == id);
        setVal(dat.value);
    });
    
    const options = [
      {
        name: "Arithmetic Operations",
        options: [
          { name: "Sum" },
          { name: "Difference" },
          { name: "Multiply" },
        ],
      },
      {
        name: "State Management",
        options: [
          { name: "Static Variable" },
          { name: "Trigger Variable"}
        ],
      },
    ]

    const updateValue = e => {
      updateNode(FlowStores, id, {value:{name : e.name}})
    }
    return <div class="nodeContNoDrag NodeContent scriptNode" 
    style="
    margin-right: 5px;
    margin-bottom: 3px;
    margin-top: 3px;">
              <Dropdown 
              options={options}
              value={inpVal()} 
              onFocus={e => layout?.viewer?.pause()}
              onBlur={e => layout?.viewer?.resume()}
              onChange={e => updateValue(e)}
              />
              <div class="scriptInfoButton" title="Open Script"><i class="fa-solid fa-file-code"></i></div>
          </div>
  }

  export {
    inputBox,
    signal,
    slider,
    toggle,
    javascript
  }