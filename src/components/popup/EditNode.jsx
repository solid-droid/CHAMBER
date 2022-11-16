import { windowData } from "../../scripts/store";
import {getNode} from '../../plugins/FlowEditor/FlowScript';
import { inputBox, inputSignal } from "./ConfigTemplate";

const EditNode = (props) => {
  const FlowStores  = windowData[0].flowEditor;
  const [nodeStore, setNodeStore] = FlowStores.nodeStore;
  let node = {}
  node = getNode(props.node , FlowStores);
const widgets = {
    'InputBox' : () => inputBox(node,FlowStores,setNodeStore),
    'Slider': () => alert('slider'),
    'Toggle' : () => alert('Toggle'),
    'HTML Widget': () => alert('custom'),
    
    'Javascript' : () => alert('script'),

    'Join' : () => alert('join'),
    'Split' : () => alert('split'),

    'Input Signal': () => inputSignal(node,FlowStores,setNodeStore),
    'Output Signal': () => alert('OS'),
    'Log Signal': () => alert('log')
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