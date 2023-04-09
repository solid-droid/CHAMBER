import { windowData } from "../../scripts/store";
import {getNode} from '../../plugins/FlowEditor/FlowScript';
import * as template from "./ConfigTemplate";

const EditNode = (props) => {
  const FlowStores  = windowData[0].flowEditor;
  const [nodeStore, setNodeStore] = FlowStores.nodeStore;
  let node = {}
  node = getNode(props.node , FlowStores);
const widgets = {
    'InputBox' : () => template.inputBox(node,FlowStores,setNodeStore),
    'Slider': () =>  template.slider(node,FlowStores,setNodeStore),
    'Toggle' : () =>  template.toggle(node,FlowStores,setNodeStore),
    'HTML Widget': () => alert('custom'),
    
    'Javascript' : () =>  template.javascript(node,FlowStores,setNodeStore),
    'Blueprint' : () =>  template.javascript(node,FlowStores,setNodeStore),

    'Join' : () =>  template.join(node,FlowStores,setNodeStore),
    'Split' : () =>  template.split(node,FlowStores,setNodeStore),
    'Box3D': () =>  template.box3D(node,FlowStores,setNodeStore),
    'Sphere3D': () =>  template.sphere3D(node,FlowStores,setNodeStore),

    'Input Signal': () =>  template.signal(node,FlowStores,setNodeStore),
    'Output Signal': () =>  template.signal(node,FlowStores,setNodeStore),
    'Log Signal': () =>  template.signal(node,FlowStores,setNodeStore)
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