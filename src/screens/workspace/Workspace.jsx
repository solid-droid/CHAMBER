import { exportFile, importJSON, clear } from "../../scripts/scripts";
import './Workspace.css';
function Workspace(params) {
  const fr = new FileReader();
  let inputRef;
  fr.onload = e => { 
    importJSON(JSON.parse(e.target.result))
  }

  const importProject = () => {
    const files = document.getElementById('selectFiles').files;
    if (files.length > 0) {
      fr.readAsText(files.item(0));
    }
  }

  return (
    <div class="workspace_container">    
      <div class="section">
        <div class="title">Project Name</div>
        <div class="value"><input/></div>
      </div>
      <div class="section">
        <div class="title">Author</div>
        <div class="value"><input/></div>
      </div>
      <div class="section">
        <div class="title">Description</div>
        <div class="value"><input/></div>
      </div>
      <div class="buttonList">
        <div class="button"onClick={() => clear()}>Clear</div>
        <div class="button"onClick={() => inputRef.click()}>Import</div>
        <div class="button" onClick={() => exportFile()}>Export</div>
        <div class="button"onClick={()=>{}}>Publish</div>
      </div>    
      <input ref={inputRef} type="file" id="selectFiles" value="Import" onInput={importProject} hidden/>
    </div>

  )
}

export default Workspace;