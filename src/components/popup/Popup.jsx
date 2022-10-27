import './Popup.css'
import {popupData} from '../../scripts/store'
import { Show } from 'solid-js';
export const Popup = (props) => {
  const [popup, setPopup] = popupData;
  return (
    <Show when={popup.open}>
      <div class="popupMask">
        <div class="Popup_Container">
            <div class="popup_close" onClick={() => setPopup({open:false})}>
              <div class="symbol">
                ✖
              </div>
            </div>
            <div class="popup_header"></div>
            <div class="popup_content"></div>
            <div class="popup_footer"></div>
        </div>
      </div>
    </Show>

  )
}