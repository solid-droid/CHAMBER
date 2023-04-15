import {clearFlowEditor, rescaleSVG} from '../../plugins/FlowEditor/FlowScript'
import { importJSON, updateMasterFile, clear } from '../../scripts/scripts'
import { masterFile } from "../../scripts/store";
import Dropdown from '../../plugins/Dropdown/Dropdown'
import { createSignal } from 'solid-js';
const NodeEditorToolbar = () => {
  const [blueprint , setBlueprint] = createSignal({ name: "Sum" });
  const options = [
    {
      name: "Blueprints",
      options: [
        { name: "Sum" },
        { name: "Difference" },
        { name: "Multiply" },
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
            New
        </div>
        <div class="toolBarButton">
            Save
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
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Help
        </div>

    </div>
  )
}

export default NodeEditorToolbar