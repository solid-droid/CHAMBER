import { windowData } from "../../scripts/store";
import {getNode, updateNode} from '../../plugins/FlowEditor/FlowScript';
import { createSignal } from "solid-js";

const EditNode = (props) => {
  const FlowStores  = windowData[0].flowEditor;
  const [nodeStore, setNodeStore] = FlowStores.nodeStore;
  let node = {}
  node = getNode(props.node , FlowStores);
const widgets = {
    'InputBox' : () => inputBox(),
    'Slider': () => alert('slider'),
    'Toggle' : () => alert('Toggle'),
    'HTML Widget': () => alert('custom'),
    
    'Javascript' : () => alert('script'),

    'Join' : () => alert('join'),
    'Split' : () => alert('split'),

    'Input Signal': () => alert('IS'),
    'Output Signal': () => alert('OS'),
    'Log Signal': () => alert('log')
}
const inputBox = () => {
    let [type, setType] = createSignal('number');
    const typeChange = e => {
        setType(e.target.value);
        updateNode(FlowStores,node.id, {type:type()});
        setNodeStore({editedNode: node.id});
    }
    const updateValue = e => {
        updateNode(FlowStores,node.id, {value:e.target.value});
        setNodeStore({editedNode: node.id});
    }
    return <>
        <div class="section">
            <div class="key">Type</div>
            <div class="value">
                <select name="inputType" onChange={typeChange}>
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

return (
    <div class="EditNode_container">
        <div class="title">Configure Node</div>
        <div class="Node">
            <div class="content">
                {widgets[node.title]()}
            </div>
        </div>
    </div>
  )
}


export default EditNode