import {clearFlowEditor} from '../../plugins/FlowEditor/FlowScript'
import { importJSON, updateMasterFile, clear } from '../../scripts/scripts'
import { masterFile } from "../../scripts/store";

const NodeEditorToolbar = () => {
  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton" onClick={() => clearFlowEditor()}>
            Clear
        </div>
        <div class="toolBarButton" onClick={() => {
          updateMasterFile();
          const _masterFile = JSON.parse(JSON.stringify(masterFile));
          clear();
          importJSON(_masterFile);
        }}>
            Refresh
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Help
        </div>
    </div>
  )
}

export default NodeEditorToolbar