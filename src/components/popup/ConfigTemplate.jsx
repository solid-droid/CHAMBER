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

const inputSignal = (node,FlowStores,setNodeStore) => {
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
    inputSignal
}