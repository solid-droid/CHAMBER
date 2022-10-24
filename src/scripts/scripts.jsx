import { windowData, masterFile, windowDispose } from "./store";
import { clearFlowEditor } from "../plugins/FlowEditor/FlowScript"

const [flowConnections, setConnectionList]  = windowData[0].flowEditor.connectionList;
const [flowNodes, setNodeList]  = windowData[0].flowEditor.nodeList;
const [flowNodeStore, setNodeStore] = windowData[0].flowEditor.nodeStore;

const updateMasterFile = () =>{
    masterFile.flowEditor = {
      nodeList:flowNodes(),
      connectionList:flowConnections(),
      nodeCounter: flowNodeStore.nodeCounter
    };
}

const exportFile =  (exportName = 'project') => {
    updateMasterFile();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masterFile));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const importJSON = (JSON=masterFile) => {
    if(JSON.flowEditor){
        loadFlowEditor(JSON.flowEditor);
    }
}

const loadFlowEditor = ({nodeList, connectionList,nodeCounter}) =>  {
    clearFlowEditor(windowData[0].flowEditor, true);
    setNodeList(nodeList);
    setConnectionList(connectionList);
    setNodeStore({nodeCounter});
}

const clear = () => {
    
    clearFlowEditor(windowData[0].flowEditor);
}

export {
    updateMasterFile,
    exportFile,
    importJSON,
    clear
}