import {safeEval} from '../../scripts/safeEval';
import { currentScript, debuggerInput, debuggerOutput } from './scriptStore';
import { terminalSignal } from "../../scripts/store";
const [terminal, setTerminal] = terminalSignal;

function runCurrentCode(){
    debuggerOutput[1]('');
    let engine = new safeEval(currentScript[0]());
    engine.getOutput(newOutput => setDebuggerOutput(newOutput));
    engine.setInput(debuggerInput[0]())
    engine.run();
}

function setDebuggerOutput(newOutput){
    if(!newOutput.error){
        if(typeof newOutput.value === 'object')
        newOutput.value = JSON.stringify(newOutput.value, null, 4);

        debuggerOutput[1](oldOutput => {
            if(oldOutput === '')
                return 'output: '+newOutput.value;

            if(newOutput.value.includes('\n'))
                newOutput.value = '\n'+newOutput.value;
            return oldOutput+'\noutput: '+newOutput.value;
        });
    } else {
        debuggerOutput[1]('error: '+newOutput.value);
    }

}

async function runCodeForExecuter(code, input, blueprint){
    let engine = new safeEval(code,blueprint);
    let _output;
    engine.getOutput(newOutput => _output = newOutput);
    engine.setInput(JSON.stringify(input));
    engine.run();
    while(!_output){
        await new Promise(r => setTimeout(r, 5));
    }
    if(_output.error){
        setTerminal({echo: 'script error: '+ _output.value});
        return null;
    }
    return _output.value;
}

let systemCode = {
Sum: 
`let inputs = Chamber.input()[0];
if(typeof inputs == 'object'){
    let sum = _.values(inputs).reduce(function(a,b){return a+b },0);
    Chamber.output([sum])
} else{
    Chamber.output([inputs])
}
`,
Multiply:
`let inputs = Chamber.input()[0];
if(typeof inputs == 'object'){
    let sum = _.values(inputs).reduce(function(a,b){return a*b },1);
    Chamber.output([sum])
} else{
    Chamber.output([inputs])
}
`,
addToStore:
`let value = Chamber.input()[0];
Chamber.store('myVariable', value);
Chamber.output([value || 0]);
`,
getFromStore:
`let value = Chamber.get('myVariable');
Chamber.output([value || 0]);
`,
}
function getCode(name, id){
    if(id){

    } else {
        return systemCode[name] || ''; 
    }
}

export {runCurrentCode, getCode, runCodeForExecuter};