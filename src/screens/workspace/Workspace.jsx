import { rescaleSVG } from "../../plugins/FlowEditor/FlowScript";
import { exportFile, importJSON, clear } from "../../scripts/scripts";
import { masterFile } from "../../scripts/store";
import './Workspace.css';
function Workspace(params) {
  const fr = new FileReader();
  let ref = {};
  fr.onload = e => { 
    const json = JSON.parse(e.target.result);
    ref.projectName.value = json.info.project;
    ref.authorName.value = json.info.author;
    ref.description.value = json.info.description;
    importJSON(json);
    $('#selectFiles')[0].value = '';
    rescaleSVG();
  }

  const importProject = () => {
    const files = document.getElementById('selectFiles').files;
    if (files.length > 0) {
      fr.readAsText(files.item(0));
    }
  }

  const exportProject = () => {
    masterFile.info = {
      project: ref.projectName.value,
      author: ref.authorName.value,
      description: ref.description.value
    }
    exportFile();
  }

  return (
    <div class="workspace_container">    
      <div class="section">
        <div class="title">Project Name</div>
        <div class="value"><input ref={ref.projectName}/></div>
      </div>
      <div class="section">
        <div class="title">Author</div>
        <div class="value"><input ref={ref.authorName}/></div>
      </div>
      <div class="section">
        <div class="title">Description</div>
        <div class="value"><input ref={ref.description}/></div>
      </div>
      <div class="buttonList">
        <div class="button"onClick={() => clear()}>Clear</div>
        <div class="button"onClick={() => ref.file.click()}>Import</div>
        <div class="button" onClick={() => exportProject()}>Export</div>
        <div class="button"onClick={()=>{}}>Publish</div>
      </div>    
      <input ref={ref.file} type="file" id="selectFiles" value="Import" onInput={importProject} hidden/>
    </div>

  )
}

export default Workspace;