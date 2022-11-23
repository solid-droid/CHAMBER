import { createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import {updateNode} from '../../plugins/FlowEditor/FlowScript';

function debounce(cb, delay = 1000) {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }


const inputBox = (node,FlowStores,setNodeStore) => {
    let selectRef;
    let [type, setType] = createSignal(node.type);
    const typeChange = e => {
        setType(e.target.value);
        updateNode(FlowStores,node.id, {type:type()});
        setNodeStore({editedNode: node.id});
    }
    const updateValue = e => {
        updateNode(FlowStores,node.id, {value:e.target.value});
        setNodeStore({editedNode: node.id});
    }
    onMount(()=>{
        selectRef.value = node.type;
    });
    return <>
        <div class="section">
            <div class="key">Type</div>
            <div class="value">
                <select ref={selectRef} name="inputType" onChange={typeChange}>
                    <option value="number">Number</option>
                    <option value="text">Text</option>
                    <option value="time">Time</option>
                    <option value="date">Date</option>
                </select>
            </div>
        </div>
        <div class="section">
            <div class="key">Value</div>
            <div class="value"><input type={type()} value={node.value} onChange={updateValue}/></div>
        </div>

    </> 
}

const signal = (node,FlowStores,setNodeStore) => {
    const updateValue = e => {
        updateNode(FlowStores,node.id, {name:e.target.value});
        setNodeStore({editedNode: node.id});
    }    
    return <div class="section">
        <div class="key">Name</div>
        <div class="value"><input type="text" value={node.name} onChange={updateValue}/></div>
    </div>
}

const join = (node,FlowStores,setNodeStore) => {
    let [inputs, setInputs] = createStore({nodeList:node.inputs});
    const deb_update = debounce((ports)=>updateData(ports))
    const updatePort = (i,e) => {
        let ports = [...inputs.nodeList];
        ports[i] = e.target.value;
        setInputs({nodeList:ports});
        deb_update(ports);
    }    

    const updateData = ports => {
        ports = ports.filter(x => x);
        updateNode(FlowStores,node.id, {inputs:ports});
        setNodeStore({editedNode: node.id});
    }

    const addPort = () => {
        setInputs({nodeList:[...inputs.nodeList,null]})
    }

    const deletePort = (i) => {
        let ports = [...inputs.nodeList];
        ports.splice(i, 1);
        setInputs({nodeList:ports});
        deb_update(ports);
    }

    return<>
    <div class="listBox">
    <For each={inputs.nodeList}>{(port, i) =>
        <div class="section3">
            <div class="key">Port Name</div>
            <div class="value"><input type="text" value={port} onChange={e => updatePort(i(),e)}/></div>
            <div class="delete" onClick={()=>deletePort(i())}><i class="fa-solid fa-trash"></i></div>
        </div>
    }</For>
    </div>
    <div class="AddPort" onClick={addPort}>
        Add Port
    </div>
    </>
}

const split = (node,FlowStores,setNodeStore) => {
    let [outputs, setOutputs] = createStore({nodeList:node.outputs});
    const updatePort = (i,e) => {
        let ports = [...outputs.nodeList];
        ports[i] = e.target.value;
        updateData(ports);
    }    

    const updateData = ports => {
        ports = ports.filter(x => x);
        updateNode(FlowStores,node.id, {outputs:ports});
        setNodeStore({editedNode: node.id});
    }

    const addPort = () => {
        setOutputs({nodeList:[...outputs.nodeList,null]})
    }

    const deletePort = (i) => {
        let ports = [...outputs.nodeList];
        ports.splice(i, 1);
        setOutputs({nodeList:ports});
        updateData(ports);
    }

    return<>
    <div class="listBox">
    <For each={outputs.nodeList}>{(port, i) =>
        <div class="section3">
            <div class="key">Port Name</div>
            <div class="value"><input type="text" value={port} onInput={e => updatePort(i(),e)}/></div>
            <div class="delete" onClick={()=>deletePort(i())}><i class="fa-solid fa-trash"></i></div>
        </div>
    }</For>
    </div>
    <div class="AddPort" onClick={addPort}>
        Add Port
    </div>
    </>
}

const box3D = (node,FlowStores,setNodeStore) => {
    const updateValue = e => {
        updateNode(FlowStores,node.id, {name:e.target.value});
        setNodeStore({editedNode: node.id});
    }    
    return <div class="section">
        <div class="key">Name</div>
        <div class="value"><input type="text" value={node.name} onChange={updateValue}/></div>
    </div>
}

export {
    inputBox,
    signal,
    join,
    split,
    box3D
}