import {clearFlowEditor, rescaleSVG} from '../../plugins/FlowEditor/FlowScript'
import { importJSON, updateMasterFile, clear } from '../../scripts/scripts'
import { masterFile } from "../../scripts/store";
import Dropdown from '../../plugins/Dropdown/Dropdown'
import { createSignal } from 'solid-js';
const NodeEditorToolbar = () => {
  const [blueprint , setBlueprint] = createSignal({ name: "dummy1" });
  const options = [
    {
      name: "Blueprints",
      options: [
        { name: "dummy1" },
        { name: "dummy2" },
        { name: "dummy3" },
      ],
    }
  ]

  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton dropdownToolBar" >
              <Dropdown 
                value={blueprint()}
                options={options}
                />
        </div>
        <div class="toolBarButton">
            Options
        </div>
        <div class="toolBarButton">
            New
        </div>
        <div class="toolBarButton" >
              Delete
        </div>
        <div class="toolBarButton" onClick={() => clearFlowEditor()}>
            Clear
        </div>
        <div class="toolBarButton" onClick={() => {
          updateMasterFile();
          const _masterFile = JSON.parse(JSON.stringify(masterFile));
          clear();
          importJSON(_masterFile);
          rescaleSVG();
        }}>
            Refresh
        </div>
        <div class="toolBarButton">
            Export
        </div>
        <div class="toolBarButton">
            Import
        </div>
    </div>
  )
}

export default NodeEditorToolbar