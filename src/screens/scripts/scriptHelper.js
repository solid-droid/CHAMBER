import {safeEval} from '../../scripts/safeEval';
import { currentScript, debuggerInput, debuggerOutput } from './scriptStore';

function runCurrentCode(){
    debuggerOutput[1]('');
    let engine = new safeEval(currentScript[0]());
    engine.getOutput(newOutput => setDebuggerOutput(newOutput));
    engine.setInput(debuggerInput[0]())
    engine.run();
}

function setDebuggerOutput(newOutput){
    if(typeof newOutput === 'object')
        newOutput = JSON.stringify(newOutput, null, 4);

    debuggerOutput[1](oldOutput => {
        if(oldOutput === '')
            return 'output: '+newOutput;
        return oldOutput+'\noutput: '+newOutput;
    });
}

export {runCurrentCode};