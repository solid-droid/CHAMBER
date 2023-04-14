import { createSignal } from 'solid-js'
import Dropdown from '../../plugins/Dropdown/Dropdown'
const ScriptEditorToolbar = () => {
  let helpMethods =  [
    'getInputs() => Use this method to get inputs from Blueprint',
    'setOutput(value) => Use this method to output a value to Blueprint',
    'storeValue(key, value , blueprint = false) => variable store - global/blueprint level.',
    'getValue(key, value, blueprint = false) => access stored values from global/blueprint.'
  ]
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
            <div class="toolBarButton" 
            style="width: 150px;
                   padding-right: 5px;" >
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
            <div class="toolBarButton" >
              Publish
            </div>
            <div class="toolBarButton" >
              Cloud
            </div>
            <div class="toolBarButton" onClick={() => alert(`
            ///Inbuilt Methods///
            getInputs()
            setOutput(value)
            storeValue(key, value , blueprint = false)
            getValue(key, value, blueprint = false)
            `)}>
                Help
            </div>
        </div>
    </>
    
  )
}

export default ScriptEditorToolbar