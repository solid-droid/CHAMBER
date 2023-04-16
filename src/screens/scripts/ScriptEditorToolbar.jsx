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
        { name: "Difference" },
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