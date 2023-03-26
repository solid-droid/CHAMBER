import { createEffect } from "solid-js";
import { openMenu } from "../../../scripts/store";
const Debugger = () => {
    let terminal;
    const [menu] = openMenu;
    createEffect(()=>{
        if(menu.controls){
            terminal = $('#debugger').terminal(function(cmd){
                
            },{
                greeting:'> '
            });

            
        } else {
           
        }
    })
  return <div id="debugger"></div>
}

export default Debugger