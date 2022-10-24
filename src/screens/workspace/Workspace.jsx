import { exportFile, importJSON, clear } from "../../scripts/scripts";

function Workspace(params) {
  const fr = new FileReader();
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
    <>
    <div>Workspace</div>
    <button onClick={() => exportFile()}>export</button>
    <div></div>
    <input type="file" id="selectFiles" value="Import" />
    <button onClick={() => clear()}>clear</button>
    <button onClick={() => importProject()}>Import</button>
    </>

  )
}

export default Workspace;