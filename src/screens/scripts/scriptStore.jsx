import { createStore } from "solid-js/store";
import {createSignal} from "solid-js";
const scriptList = createStore({});
const debuggerInput = createSignal('');
const debuggerOutput = createSignal('');
const selectedScript = createStore({});
const currentScript = createSignal('');
export {
    scriptList,
    currentScript,
    debuggerInput,
    debuggerOutput,
    selectedScript
}