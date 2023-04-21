import { terminalSignal } from "../../scripts/store"
import { run, pause } from "../../scripts/executer";
import Dropdown from '../../plugins/Dropdown/Dropdown'

const ControlsToolbar = () => {
  const [terminal , setTerminal] = terminalSignal;
  const fr = new FileReader();
  let ref = {};
  fr.onload = e => { 
    const json = JSON.parse(e.target.result);
    setTerminal({import:true, logConfig:json})
    $('#selectedLog')[0].value = '';
  }


  const importProject = () => {
    const files = document.getElementById('selectedLog').files;
    if (files.length > 0) {
      fr.readAsText(files.item(0));
    }
  }
  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton" onClick={() => setTerminal({export:true})}>
            Export
        </div>
        <div class="toolBarButton" onClick={() => ref.file.click()}>
            Import
        </div>
        <div class="toolBarButton" onClick={() => setTerminal({clear : true})}>
            Clear
        </div>
        <input ref={ref.file} type="file" id="selectedLog" value="Import" onInput={importProject} hidden/>
    </div>
  )
}

export default ControlsToolbar