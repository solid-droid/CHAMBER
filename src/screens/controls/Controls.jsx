import {FlowContainer, FlowNode, createFlowStores} from "../../plugins/FlowEditor/FlowEditor";

const Controls = () => {
  const {
    nodeStore,
    connectionStore,
    layoutStore,
    nodeList,
    connectionList
  }  = createFlowStores();
  
  const [connections , setConnections] = connectionList;
  
  setConnections('connections', () => [
    [['node2','out1'],['node1','in1']],
    [['node2','out2'],['node1','in2']]
  ]);

  return (
    <FlowContainer {...{
      nodeStore,
      connectionStore,
      layoutStore,
      nodeList,
      connectionList
    }}>
      <FlowNode id="node1" inputs={['in1','in2','in3']} outputs={['out1']} {...{nodeList}}/>
      <FlowNode id="node2" inputs={['in1']} outputs={['out1' , 'out2']} {...{nodeList}}/>
    </FlowContainer>
  )
}

export default Controls