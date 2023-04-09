/* @refresh reload */
import { render } from 'solid-js/web';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import "@thisbeyond/solid-select/style.css";
import './index.css';
import App from './App';

render(() => <App />, document.getElementById('root'));
