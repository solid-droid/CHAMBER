import {openMenu} from '../../scripts/store';

function GraphEditor() {
  const [menu] = openMenu;
  return (
    <div>GraphEditor {menu.workspace ? 1 : 0}</div>
  )
}

export default GraphEditor