import quickJS from '../../scripts/quickJShelper';
import { currentScript, debuggerInput, debuggerOutput } from './scriptStore';
import { terminalSignal } from "../../scripts/store";
const [terminal, setTerminal] = terminalSignal;

const systemCode = {
    Sum: 
`const inputs = JSON.parse(Chamber.input())[0];
const sum = Object.values(inputs).reduce((a,b) => a+b ,0);
Chamber.output([sum])
`,
    Multiply:
`const inputs = JSON.parse(Chamber.input())[0];
const product = Object.values(inputs).reduce((a,b) => a*b ,1);
Chamber.output([product])
`,
    addToStore:
`let value = JSON.parse(Chamber.input())[0];
Chamber.store('myVariable', value);
Chamber.output([value || 0]);
`,
getFromStore:
`let value = Chamber.get('myVariable');
Chamber.output([value || 0]);
`,
    }

function runCurrentCode(){
    debuggerOutput[1]('');
    let engine = new quickJS(currentScript[0]());
    engine.getOutput(newOutput => setDebuggerOutput(newOutput));
    engine.setInput(debuggerInput[0]())
    engine.run();
    // --------------------------------------------
    // debuggerOutput[1]('');
    // let engine = new safeEval(currentScript[0]());
    // engine.getOutput(newOutput => setDebuggerOutput(newOutput));
    // engine.setInput(debuggerInput[0]())
    // engine.run();
}


const stringify = (obj, indent = 2) => 
  JSON.stringify(obj, (key, value) => {
    if (Array.isArray(value) && !value.some(x => x && typeof x === 'object')) {
      return `\uE000${JSON.stringify(value.map(v => typeof v === 'string' ? v.replace(/"/g, '\uE001') : v))}\uE000`;
    }
    return value;
  }, indent).replace(/"\uE000([^\uE000]+)\uE000"/g, match => match.substr(2, match.length - 4).replace(/\\"/g, '"').replace(/\uE001/g, '\\\"'));


function setDebuggerOutput(newOutput){
    if(!newOutput.error){
        if(typeof newOutput.value === 'object')
        newOutput.value = stringify(newOutput.value);
        debuggerOutput[1](oldOutput => {
            if(oldOutput === '')
                return newOutput.value;

            if(newOutput.value.includes('\n'))
                newOutput.value = newOutput.value;
            return oldOutput+'\n---------------------\n'+newOutput.value;
        });
    } else {
        debuggerOutput[1]('error: '+newOutput.value);
    }

}

async function runCodeForExecuter(code, input, blueprint){
    let engine = new quickJS(code,blueprint);
    let _output;
    engine.getOutput(newOutput => _output = newOutput);
    engine.setInput(input);
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

function getCode(name, id){
    if(id){

    } else {
        return systemCode[name] || ''; 
    }
}

export {runCurrentCode, getCode, runCodeForExecuter};