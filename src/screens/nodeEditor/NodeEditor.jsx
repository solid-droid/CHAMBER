import {FlowContainer, FlowNode, createFlowStores} from "../../plugins/FlowEditor/FlowEditor";
const NodeEditor = () => {
  const FlowStores  = createFlowStores();
  
  const [connectionList , setConnectionList] = FlowStores.connectionList;
  
  setConnectionList(_conn => 
    [
      [['node2',1],['node1',1]],
      [['node2',2],['node1',2]],
      [['node1',1],['node3',1]],
      ..._conn
  ]);

  return (
    <FlowContainer {...FlowStores}>
      <FlowNode 
      id="node1" 
      inputs={['in1','in2','input number 3']} 
      outputs={['out1']}
      x="100"
      y="100"
      {...FlowStores}
      />
      <FlowNode 
      id="node2" 
      inputs={['in1']} 
      outputs={['out1' , 'out2']} 
      x="0"
      y="0" 
      {...FlowStores}/>

      <FlowNode 
      id="node3" 
      inputs={['in1']} 
      outputs={['out1' , 'out2']} 
      x="300"
      y="400" 
      {...FlowStores}/>
    </FlowContainer>
  )
}

export default NodeEditor