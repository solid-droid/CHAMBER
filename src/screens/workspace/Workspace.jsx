import { windowData } from "../../scripts/store";
import { clearFlowEditor } from "../../plugins/FlowEditor/FlowScript"

function Workspace(params) {
  const [flowConnections, setConnectionList]  = windowData[0].flowEditor.connectionList;
  const [flowNodes, setNodeList]  = windowData[0].flowEditor.nodeList;
  const [nodeObj]  = windowData[0].flowEditor.nodeObj;
  const masterFile = {};
  const fr = new FileReader();
  fr.onload = e => { 
    const result = JSON.parse(e.target.result);
    loadFlowEditor(result.flowEditor);
  }

const clear = () => {
  clearFlowEditor(windowData[0].flowEditor);
}

 const loadFlowEditor = ({nodeList, connectionList}) =>  {
        clearFlowEditor(windowData[0].flowEditor);
        setNodeList(nodeList);
        setConnectionList(connectionList);
  }

  const updateExportFile = () =>{
    masterFile.flowEditor = {
      nodeList:flowNodes(),
      connectionList:flowConnections()
    };
  }

  const exportFile = (exportName = 'project') => {
    updateExportFile();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masterFile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const importProject = () => {
    const files = document.getElementById('selectFiles').files;
    if (files.length > 0) {
      fr.readAsText(files.item(0));
    }
  }

  return (
    <>
    <div>Workspace</div>
    <button onClick={() => exportFile()}>export</button>
    <div></div>
    <input type="file" id="selectFiles" value="Import" />
    <button onClick={() => clear()}>clear</button>
    <button onClick={() => importProject()}>Import</button>
    </>

  )
}

export default Workspace;