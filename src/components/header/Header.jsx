import './Header.css'
import {openMenu} from '../../scripts/store'

export const Header = () => {
  const [menu, setMenu ] = openMenu;
  const setMenuState = selectedMenu => setMenu({[selectedMenu]: !menu[selectedMenu]});

  return (
    <div class="header" >
      <div class="Menu screens">
        <div class={menu.workspace ? 'MenuItem active' : 'MenuItem'} title='Workspace'onClick={() => setMenuState('workspace')}>
          <i class="fa-solid fa-layer-group"></i>
        </div>
        <div class={menu.connections ? 'MenuItem active' : 'MenuItem'} title='Connections' onClick={() => setMenuState('connections')}>
          <i class="fa-solid fa-tower-broadcast"></i>
        </div>
        <div class={menu.nodeEditor ? 'MenuItem active' : 'MenuItem'} title='Node Editor' onClick={() => setMenuState('nodeEditor')}>
          <i class="fa-solid fa-diagram-project"></i>
        </div>
        <div class={menu.simulator ? 'MenuItem active' : 'MenuItem'} title='Simulator' onClick={() => setMenuState('simulator')}>
          <i class="fa-solid fa-cubes"></i>
        </div>
        <div class={menu.analytics ? 'MenuItem active' : 'MenuItem'} title='Analytics' onClick={() => setMenuState('analytics')}>
        <i class="fa-solid fa-chart-pie"></i>
        </div>
      </div>  

      <div class="Menu MenuList">
        <div class={menu.controls ? 'MenuItem last active' : 'last MenuItem'} title='Controls' onClick={() => setMenuState('controls')}>
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </div>
        <div class={menu.debugger ? 'MenuItem active' : 'MenuItem'} title='Debug' onClick={() => setMenuState('debugger')}>
          <i class="fa-solid fa-terminal"></i>
        </div>
      </div>

      <div class="Menu Logo" title="v0.01 alpha">CHAMBER</div>
    </div>
  )
}
