import { onMount } from "solid-js";
import { nodeList } from "./FlowStore";

const FlowNode = (props) => {
  const [nodes , setNodes] = nodeList;


  onMount(async ()=>{
    setNodes({
      [`FlowNode_${props.id}`]:{
        x:0,
        y:0
      }
    });
  });

  return (
    <div id={`FlowNode_${props.id}`} class="FlowNode">
      <div class="FN_head">
          testBox
      </div>
      <div class="FN_body">
          <div class="FN_inputs">
            tt1
          </div>
          <div class="FN_content">
            tt2
          </div>
          <div class="FN_outputs">
            tt3
          </div>
      </div>
    </div>
  )
}

export default FlowNode