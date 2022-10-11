//controls 
import './Header.css'
export const Header = () => {
  return (
    <div class="header" >
      <div class="Menu screens">
        <div class="MenuItem" title='Workspace'>
          <i class="fa-solid fa-layer-group"></i>
        </div>
        <div class="MenuItem" title='Connections'>
          <i class="fa-solid fa-tower-broadcast"></i>
        </div>
        <div class="MenuItem" title='Graph Editor'>
          <i class="fa-solid fa-diagram-project"></i>
        </div>
        <div class="MenuItem last" title='3D Simulator'>
          <i class="fa-solid fa-cubes"></i>
        </div>
      </div>  

      <div class="Menu MenuList">
        <div class="MenuItem controls" title='Controls'>
          <i class="fa-solid fa-play"></i>
          <i class="fa-solid fa-pause"></i>
        </div>
        <div class="MenuItem last" title='Debug'>
          <i class="fa-solid fa-terminal"></i>
        </div>
      </div>

      <div class="Menu Logo">CHAMBER</div>
    </div>
  )
}
