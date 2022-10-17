import {FlowContainer, FlowNode, createFlowStores} from "../../plugins/FlowEditor/FlowEditor";
const NodeEditor = () => {
  const {
    nodeStore,
    connectionStore,
    layoutStore,
    nodeList,
    connectionList
  }  = createFlowStores();
  
  const [connections , setConnections] = connectionList;
  
  setConnections('connections', () => [
    [['node2',1],['node1',1]],
    [['node2',2],['node1',2]]
  ]);

  return (
    <FlowContainer {...{
      nodeStore,
      connectionStore,
      layoutStore,
      nodeList,
      connectionList
    }}>
      <FlowNode 
      id="node1" 
      inputs={['in1','in2','input number 3']} 
      outputs={['out1']}
      x="100"
      y="100"
      {...{nodeList}}
      />
      <FlowNode 
      id="node2" 
      inputs={['in1']} 
      outputs={['out1' , 'out2']} 
      x="0"
      y="0" 
      {...{nodeList}}/>
    </FlowContainer>
  )
}

export default NodeEditor