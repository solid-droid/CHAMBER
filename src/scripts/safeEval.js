window.globalStore = {};
window.localStore = {};
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
        this.input = input;
    }

    getInput(self){
        return self.input;
    }

    setOutput(value , self){
        let _val;
        if(typeof value === 'object')
            _val = JSON.parse(JSON.stringify(value));
        else 
            _val = value;

        _val = this.cleanupObject(_val);
        self.output = _val;
        self.outputFunc.forEach(x => x(self.output));
    }

    cleanupObject(value){
        if(typeof value === 'object'){
            const _class = value.class;
            value = value.properties;
            Object.keys(value).forEach(key => {
                value[key] = this.cleanupObject(value[key])
            });
            if(_class === 'Array'){
                value = Object.values(value);
            }
        }

        return value;
    }
    getOutput(x){
        (x && this.outputFunc.push(x));
    }

    store(key , value, global, self){
        if(global){
            window.globalStore[key] = value;
        } else {
            window.localStore[self.blueprint] ??= {};
            window.localStore[self.blueprint][key] = value;
        }
    }

    getStore(key, global, self ){
        if(global){
            return window.globalStore[key];
        } else {
            return window.localStore[self.blueprint]?.[key];
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
        interpreter.setProperty(globalObject, 'Chamber', chamber);
        interpreter.setProperty(chamber, 'input', interpreter.createNativeFunction(() => self.getInput(self)));
        interpreter.setProperty(chamber, 'output', interpreter.createNativeFunction((value) => self.setOutput(value, self)));
        interpreter.setProperty(chamber, 'store', interpreter.createNativeFunction((key , value, global) => self.store(key , value, global, self)));
        interpreter.setProperty(chamber, 'get', interpreter.createNativeFunction((key, global) => self.getStore(key, global, self)));
        interpreter.setProperty(chamber, 'wait', interpreter.createAsyncFunction((delay, callback) => self.wait(delay, callback, self)));
    };

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
        this.Interpreter.run();
    }
    
}




export {safeEval};