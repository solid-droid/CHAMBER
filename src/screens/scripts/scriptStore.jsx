import { createStore } from "solid-js/store";
import {createSignal} from "solid-js";
const scriptList = createStore({});
const currentScript = createSignal('');
const debuggerInput = createSignal('');
const debuggerOutput = createSignal('');
const selectedScript = createStore({name:'Sum'});
export {
    scriptList,
    currentScript,
    debuggerInput,
    debuggerOutput,
    selectedScript
}