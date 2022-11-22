import { createSignal, onMount } from "solid-js";
import {updateNode} from '../../plugins/FlowEditor/FlowScript';

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
    let [inputs, setInputs] = createSignal(node.inputs);
    const updatePort = (i,e) => {
        console.log(i,e.target.value);
        // updateNode(FlowStores,node.id, {name:e.target.value});
        // setNodeStore({editedNode: node.id});
    }    

    const addPort = () => {
        const list = inputs();
        list.push(null)
        setInputs(list)
    }
    return<>
    <div class="listBox">
    <For each={inputs()}>{(port, i) =>
        <div class="section3">
            <div class="key">Port Name</div>
            <div class="value"><input type="text" value={port} onChange={e => updatePort(i(),e)}/></div>
            <div class="delete"><i class="fa-solid fa-trash"></i></div>
        </div>
    }</For>
    </div>
    <div class="AddPort" onClick={addPort}>
        Add Port
    </div>
    </>
}

export {
    inputBox,
    signal,
    join
}