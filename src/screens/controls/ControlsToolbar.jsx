const ControlsToolbar = () => {
  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton">
            Play
        </div>
        <div class="toolBarButton">
            Pause
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Export
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Help
        </div>
    </div>
  )
}

export default ControlsToolbar