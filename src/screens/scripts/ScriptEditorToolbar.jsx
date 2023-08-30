import Dropdown from '../../plugins/Dropdown/Dropdown'
import { runCurrentCode } from './scriptHelper'
import { selectedScript } from './scriptStore'
const ScriptEditorToolbar = () => {
  let [script, setScript] = selectedScript;
  const options = [
    {
      name: "Arithmetic Operations",
      options: [
        { name: "Sum" },
        { name: "Multiply" },
      ],
    },
    {
      name: "State Management",
      options: [
        { name: "addToStore" },
        { name: "getFromStore"}
      ],
    },
  ]
  return (
    <>
        <div class="NodeEditorToolbar">
            <div class="toolBarButton dropdownToolBar">
              <Dropdown 
                value = {{name:script.name,id:script.id}}
                options={options}
                onChange={e => setScript({name : e.name, id: e.id})}
                />
            </div>
            <div class="toolBarButton" >
              New
            </div>
            <div class="toolBarButton" >
              Delete
            </div>
            <div class="toolBarButton" onClick={()=>runCurrentCode()}>
              Run
            </div>
            <div class="toolBarButton" >
              Publish
            </div>
            <div class="toolBarButton" >
              Import
            </div>
            <div class="toolBarNotification" >
              <div class="statusIcon disabled"></div>
            </div>
        </div>
    </>
    
  )
}

export default ScriptEditorToolbar