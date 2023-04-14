const ScriptEditorToolbar = () => {
  let helpMethods =  [
    'getInputs() => Use this method to get inputs from Blueprint',
    'setOutput(value) => Use this method to output a value to Blueprint',
    'storeValue(key, value , blueprint = false) => variable store - global/blueprint level.',
    'getValue(key, value, blueprint = false) => access stored values from global/blueprint.'
  ]
  return (
    <>
        <div class="NodeEditorToolbar">
            <div class="toolBarButton" >
                Help
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