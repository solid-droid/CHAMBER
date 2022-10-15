import {FlowContainer, FlowNode , FlowConnection} from "../../plugins/FlowEditor/FlowEditor"

const Controls = () => {
  return (
    <FlowContainer>
      <FlowNode id="1" inputs={['a','b','c']} output={['out1']}/>
      <FlowNode id="2" inputs={['inp1']} outputs={['out1' , 'out2']}/>
    </FlowContainer>
  )
}

export default Controls