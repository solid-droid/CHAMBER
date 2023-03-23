import './Popup.css'
import {popupData} from '../../scripts/store'
import { Show } from 'solid-js';
import EditNode from './EditNode';
export const Popup = (props) => {
  const [popup, setPopup] = popupData;
  return (
    <Show when={popup.open}>
      <div class="popupMask">
        <div class="Popup_Container">
              <Show when={popup.type=='editNode'}>
                <EditNode node={popup.node} />
              </Show>
          </div>
      </div>
    </Show>

  )
}