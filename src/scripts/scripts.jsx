import { windowData, masterFile } from "./store";
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

const createFile = (fileName, fileObj) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fileObj));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", fileName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

const exportFile =  (exportName = 'project') => {
    updateMasterFile();
    createFile(exportName,masterFile);
}



const importJSON = (JSON=masterFile) => {
    if(JSON.flowEditor){
        loadFlowEditor(JSON.flowEditor);
    }
}

const loadFlowEditor = ({nodeList, connectionList,nodeCounter}) =>  {
    clearFlowEditor(windowData[0].flowEditor);
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
    clear,
    createFile
}