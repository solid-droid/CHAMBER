import { updateMasterFile } from "./scripts";
import { masterFile, terminalSignal, windowData } from "./store";
import { createEffect } from "solid-js";


let loop;
const [terminal, setTerminal] = terminalSignal;
const FlowStores  = windowData[0].flowEditor;
const [nodeStore, setNodeStore] = FlowStores.nodeStore;

const execute = () => {
    const nodes = masterFile.flowEditor.nodeList;
    const connections = masterFile.flowEditor.connectionList;
    const outputs = [];
    const inputs = [];
    const controlers = [];
    const nodeTree = {};
    nodes.forEach(x => {
        nodeTree[x.id] = JSON.parse(JSON.stringify(x));
        (x.dataflow == "output" && outputs.push(nodeTree[x.id]));
        (x.dataflow == "input" && inputs.push(nodeTree[x.id]));
        (x.dataflow == "control" && controlers.push(nodeTree[x.id]));
    });
    connections.forEach(([from,to]) => {
        const [fromID, fromPort] = from;
        const [toID, toPort] = to;
        nodeTree[fromID].children ??= [];
        nodeTree[fromID].children.push(nodeTree[toID]);
        nodeTree[toID].parents ??= [];
        nodeTree[toID].parents.push(nodeTree[fromID]);
    });

    let membuffer = {};
    const getMembuffer = () => membuffer;
    const computeNode = (node,value) => {
        const membuffer = getMembuffer();
        if(membuffer[node.id])
        return value;
        
        const parser = {
            'Toggle' : () => value,
            'Slider' : () => parseFloat(value),
            'InputBox' : () => parser[node.type](),
            'number'   : () => parseFloat(value),
            'Join'     : () => {
                const output =  {};
                value.forEach((x,i) => {
                    output[node.inputs[i]] = x;
                });
                return output;
            },
            'Split' : () => {
                return Object.values(value[0])
            }
        };
        membuffer[node.id] = parser[node.title]();
        return membuffer[node.id];
    }

    const getPort = (curr,prev) => connections.find(([from,to])=> from[0] == curr.id && to[0]== prev.id)[0][1]-1;
    const getPortList = (id, _from=false) => connections.filter(([from,to])=> _from ? from[0] == id : to[0]== id)
    const findOutput = (arr, prevNode) => {
        let value = [];
        arr?.forEach(x => {
            if(x.dataflow === 'output'){
                x.nodeValue = findOutput(x.parents, x);
            } else {
                const _value = getMembuffer()[x.id];
                if(x.parents && !_value){
                    let _prr = {}
                    getPortList(x.id)
                        .map(y => [y[0][0], y[1][1]])
                        .forEach(([k,v])=> _prr[k] = v);
                    x.parents.sort((a,b)=> _prr[a.id] - _prr[b.id] );
                    
                    let _val = computeNode(x, findOutput(x.parents, x));
                    if(Array.isArray(_val)){
                        value.push( _val[getPort(x,prevNode)]);
                    } else {
                        value.push(_val);
                    }
                    
                } else if(_value) {
                    if(Array.isArray(_value)){
                        value.push( _value[getPort(x,prevNode)]);
                    } else {
                        value.push(_value);
                    }
                } else {
                    const _val = computeNode(x, x.value);
                    if(Array.isArray(_val)){
                        value.push( _val[getPort(x,prevNode)]);
                    } else {
                        value.push(_val);
                    }
                }
            }
        })
        return value;
    }

    findOutput(outputs, null);
    return outputs;
}

const getString = val => {
    if(val === null || val === undefined){
        return 'null'
    }

    if(typeof val == 'object' || Array.isArray(val)){
        return JSON.stringify(val);
    }

    return val;
}

const broadcastOutput = outputs => {
    let dat = '', showCurser = false;
    outputs.forEach(item => {
        if(item.title=='Log Signal'){
            if(showCurser)
            dat+='> '
            else 
            showCurser = true;

            dat+=`${item.name}: ${JSON.stringify(item.nodeValue)} \n`
        }
    });
    dat = dat.trim();
    (dat !== '' && setTerminal({echo: dat}));
}

const run = () => {     
            updateMasterFile();
            const outputs = execute();
            broadcastOutput(outputs);
}

const runLoop = (time = 100) =>{
    if(!loop){
        loop = setInterval(()=>run(),time)
    }
}

const pause = () => {
    if(loop){
        clearInterval(loop);
        loop=null;
    }
}

createEffect(()=>{
    if(nodeStore.executeNode){
        setNodeStore({executeNode:null})
        run();
    }
})
export {
    run,
    runLoop,
    pause
}