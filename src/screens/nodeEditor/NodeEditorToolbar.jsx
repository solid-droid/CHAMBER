import {clearFlowEditor} from '../../plugins/FlowEditor/FlowScript'

const NodeEditorToolbar = () => {
  return (
    <div class="NodeEditorToolbar">
        <div class="toolBarButton" onClick={() => clearFlowEditor()}>
            Clear
        </div>
        <div class="toolBarButton" onClick={() => alert('Not ready')}>
            Help
        </div>
    </div>
  )
}

export default NodeEditorToolbar