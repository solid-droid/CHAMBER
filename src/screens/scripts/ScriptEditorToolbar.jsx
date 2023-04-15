import { createSignal } from 'solid-js'
import Dropdown from '../../plugins/Dropdown/Dropdown'
import { runCurrentCode } from './scriptHelper'
const ScriptEditorToolbar = () => {
  let [script, setScript] = createSignal({ name: "Difference" })
  const options = [
    {
      name: "Arithmetic Operations",
      options: [
        { name: "Sum" },
        { name: "Difference" },
        { name: "Multiply" },
      ],
    },
    {
      name: "State Management",
      options: [
        { name: "Static Variable" },
        { name: "Trigger Variable"}
      ],
    },
  ]
  return (
    <>
        <div class="NodeEditorToolbar">
            <div class="toolBarButton dropdownToolBar">
              <Dropdown 
                value = {script()}
                options={options}
                />
            </div>
            <div class="toolBarButton" >
              New
            </div>
            <div class="toolBarButton" >
              Save
            </div>
            <div class="toolBarButton" onClick={()=>runCurrentCode()}>
              Run
            </div>
            <div class="toolBarButton" >
              Export
            </div>
            <div class="toolBarButton" >
              Import
            </div>
            <div class="toolBarButton" onClick={() => alert(`Type Chamber`)}>
                Help
            </div>
        </div>
    </>
    
  )
}

export default ScriptEditorToolbar