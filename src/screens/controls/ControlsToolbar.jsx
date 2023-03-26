import { terminalSignal } from "../../scripts/store"
const ControlsToolbar = () => {
  const [terminal , setTerminal] = terminalSignal;
  const fr = new FileReader();
  let ref = {};
  fr.onload = e => { 
    const json = JSON.parse(e.target.result);
    setTerminal({import:true, logConfig:json})
  }

  const importProject = () => {
    const files = document.getElementById('selectFiles').files;
    if (files.length > 0) {
      fr.readAsText(files.item(0));
    }
  }
  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton" onClick={() => setTerminal({progressBar : true, progressPercent: terminal.progressPercent + 10})}>
            Play
        </div>
        <div class="toolBarButton" onClick={() => setTerminal({echo : 'done'})}>
            Pause
        </div>
        <div class="toolBarButton" onClick={() => setTerminal({export:true})}>
            Export
        </div>
        <div class="toolBarButton" onClick={() => ref.file.click()}>
            Import
        </div>
        <div class="toolBarButton" onClick={() => setTerminal({clear : true})}>
            Clear
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Help
        </div>
        <input ref={ref.file} type="file" id="selectFiles" value="Import" onInput={importProject} hidden/>
    </div>
  )
}

export default ControlsToolbar