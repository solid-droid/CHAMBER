import { windowData } from "../../scripts/store";
import {getNode} from '../../plugins/FlowEditor/FlowScript';
import { inputBox, signal, join, split } from "./ConfigTemplate";

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

    'Join' : () => join(node,FlowStores,setNodeStore),
    'Split' : () => split(node,FlowStores,setNodeStore),

    'Input Signal': () => signal(node,FlowStores,setNodeStore),
    'Output Signal': () => signal(node,FlowStores,setNodeStore),
    'Log Signal': () => signal(node,FlowStores,setNodeStore)
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