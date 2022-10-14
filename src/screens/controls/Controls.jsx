import {FlowContainer, FlowNode , FlowConnection} from "../../plugins/FlowEditor/FlowEditor"

const Controls = () => {
  return (
    <FlowContainer>
      <FlowNode id="1"/>
      <FlowNode id="2" />
      <FlowConnection id="1" from="1" to="2" />
    </FlowContainer>
  )
}

export default Controls