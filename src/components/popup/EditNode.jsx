import { windowData } from "../../scripts/store";
import {getNode, updateNode} from '../../plugins/FlowEditor/FlowScript';

const EditNode = (props) => {
  const FlowStores  = windowData[0].flowEditor;
  let node = {}
  node = getNode(props.node , FlowStores);


const inputTemplate = inputs =>             
        <div class="inputs">
            <For each={inputs}>{(item, i) =>
            <div>
                {item}
            </div>
            }
            </For>
            <div>
                Add Port
            </div>
        </div>

const outputTemplate = outputs =>             
        <div class="inputs">
            <For each={outputs}>{(item, i) =>
            <div>
                {item}
            </div>
            }
            </For>
            <div>
                Add Port
            </div>
        </div>

  return (
    <div class="EditNode_container">
        <div class="title">Configure Node</div>
        <div class="Node">
            {inputTemplate(node.inputs)}
            <div class="content"></div>
            {outputTemplate(node.outputs)}
        </div>
    </div>
  )
}


export default EditNode