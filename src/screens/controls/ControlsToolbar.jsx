import { terminalSignal } from "../../scripts/store"
const ControlsToolbar = () => {
  const [terminal , setTerminal] = terminalSignal
  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton" onClick={() => setTerminal({progressBar : true, progressPercent: terminal.progressPercent + 10})}>
            Play
        </div>
        <div class="toolBarButton" onClick={() => setTerminal({echo : 'done'})}>
            Pause
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Export
        </div>
        <div class="toolBarButton" onClick={() => setTerminal({clear : true})}>
            Clear
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Help
        </div>
    </div>
  )
}

export default ControlsToolbar