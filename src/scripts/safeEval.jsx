window.globalStore = {};
window.localStore = {};
import _, { values } from "underscore";
class safeEval{
    constructor(code , blueprint = ''){
        this.setCode(code, blueprint);
    }

    setCode(code , blueprint = ''){
        this.code = code;
        this.blueprint = blueprint;
        this.outputFunc = [];
        this.code && this.parse(code = this.code);
    }

    setInput(input){
        this.inputError =null;
        if(typeof input === 'string'){
            try{
                input = JSON.parse(input)
                if(!Array.isArray(input)){
                    this.inputError = 'Input should be an array'
                }
            } catch(e){
                this.inputError = 'Input Syntax Error'
            }
        }       
        this.input = input;
    }

    getInput(self){
        return self.Interpreter.nativeToPseudo(self.input);
    }

    setOutput(value , self=this , error = false){
        if(!error)
            self.output = value = self.Interpreter.pseudoToNative(value);
        self.outputFunc.forEach(x => x({value, error}));
    }

    


    getOutput(x){
        (x && this.outputFunc.push(x));
    }

    store(key , value, global, self){
        if(global){
            window.globalStore[key] = self.Interpreter.pseudoToNative(value);
        } else {
            window.localStore[self.blueprint] ??= {};
            window.localStore[self.blueprint][key] = self.Interpreter.pseudoToNative(value);
        }
    }

    getStore(key, global, self ){
        if(global){
            return self.Interpreter.nativeToPseudo(window.globalStore[key]);
        } else {
            return self.Interpreter.nativeToPseudo(window.localStore[self.blueprint]?.[key]);
        }
    }

    wait(delay, callback, self){
        let prom = new Promise(r => setTimeout(r,delay))
        prom.then(() => {
            callback();
            self.Interpreter.run();
        });
    }

    config(interpreter, globalObject, self) {
        let chamber = interpreter.nativeToPseudo({});
        let object = interpreter.nativeToPseudo({});
        let underscore = interpreter.nativeToPseudo({});
        interpreter.setProperty(globalObject, 'Chamber', chamber);
        interpreter.setProperty(chamber, 'input', interpreter.createNativeFunction(() => self.getInput(self)));
        interpreter.setProperty(chamber, 'output', interpreter.createNativeFunction((value) => self.setOutput(value, self)));
        interpreter.setProperty(chamber, 'store', interpreter.createNativeFunction((key , value, global) => self.store(key , value, global, self)));
        interpreter.setProperty(chamber, 'get', interpreter.createNativeFunction((key, global) => self.getStore(key, global, self)));
        interpreter.setProperty(chamber, 'wait', interpreter.createAsyncFunction((delay, callback) => self.wait(delay, callback, self)));

        interpreter.setProperty(globalObject, 'Util', object);
        interpreter.setProperty(object, 'keys', interpreter.createNativeFunction((obj) => self.util_keys(obj,self)));
        interpreter.setProperty(object, 'values', interpreter.createNativeFunction((obj) => self.util_values(obj,self)));

        interpreter.setProperty(globalObject, '_', underscore);
        Object.keys(_).forEach(key => {
            interpreter.setProperty(underscore, key, interpreter.createNativeFunction((...value) => {
               value = value.map(x =>{
                if(x.class === "Function"){
                    const params = x.node.params.map(x=>x.name);
                    const start = x.node.start;
                    const end = x.node.end;
                    return new Function( ...params, 'return '+self.code.slice(start,end)+'('+params.join()+')')
                } else {
                    return self.Interpreter.pseudoToNative(x)
                }
            });
               return  self.Interpreter.nativeToPseudo(_[key](...value));
            }));
        })

    };


    util_keys(obj,self){
        return self.Interpreter.nativeToPseudo(Object.keys(self.Interpreter.pseudoToNative(obj)))
    }

    util_values(obj,self){
        return self.Interpreter.nativeToPseudo(Object.values(self.Interpreter.pseudoToNative(obj)))
    }
    initConfig(){
        return {interpreter, globalObject };
    }

    parse(code = this.code){
        this.code = code;
        let self = this;
        this.Interpreter = new window.Interpreter(code, (interpreter, globalObject) =>  self.config(interpreter, globalObject, self));
    }

    run(){
        !this.Interpreter && this.parse();
        if(!this.inputError){
            this.Interpreter.run();
        } else {
            this.setOutput(this.inputError,this, true);
        }

        
    }
    
}




export {safeEval};