window.globalStore = {};
window.localStore = {};
export default class quickJS{
    constructor(code,blueprint){
        this.code = code;
        this.blueprint = blueprint;
        this.outputFunc = [];
        this.initVM();
    }

    parseValue(value){
        const self = this;
        if(typeof value === 'object')
            return self.vm.newString(JSON.stringify(value))

        if(typeof value === 'string')
            return self.vm.newString(value)
        
        if(typeof value === 'number')
            return self.vm.newNumber(value) 
            
        if(typeof value === 'boolean')
            return self.vm.newNumber(value ? 1 : 0) 
            
        return self.vm.newNumber(0) 
    }
    
    initVM(){
        const self = this;
        self.vm = window.QuickJS.newContext();
        const outputHandleCallback = self.vm.newFunction("output", (...args) => {
            const value = args.map(self.vm.dump)[0];
            self.outputFunc.forEach(x => x({value, error:false}));
        })
        const inputHandleCallback = self.vm.newFunction("input", (...args) => {
            return self.parseValue(self.input);
        })

        const waitHandleCallback = self.vm.newFunction("wait", (...args) => {
            const delay = args.map(self.vm.dump)[0];
            const promise = self.vm.newPromise()
            setTimeout(() => promise.resolve(), delay);
            promise.settled.then(self.vm.runtime.executePendingJobs)
            return promise.handle;
        });
        
        const setStoreHandleCallback = self.vm.newFunction('store', (...args) => {
            const [key, value, global] = args.map(self.vm.dump);
            if(global){
                window.globalStore[key] = value;
            } else {
                window.localStore[self.blueprint] ??= {};
                window.localStore[self.blueprint][key] = value;
            }
        });
        const getStoreHandleCallback = self.vm.newFunction('get', (...args) => {
            const [key, global] = args.map(self.vm.dump);
            if(global){
                return self.parseValue(window.globalStore[key]);
            } else {
                return self.parseValue(window.localStore[self.blueprint]?.[key]);
            }
        })
        const chamberHandle = self.vm.newObject()
        self.vm.setProp(chamberHandle, "output", outputHandleCallback)
        self.vm.setProp(chamberHandle, "input", inputHandleCallback)
        self.vm.setProp(chamberHandle, "wait", waitHandleCallback)
        self.vm.setProp(chamberHandle, "store", setStoreHandleCallback)
        self.vm.setProp(chamberHandle, "get", getStoreHandleCallback)
        self.vm.setProp(self.vm.global, "Chamber", chamberHandle)
        
        outputHandleCallback.dispose()
        inputHandleCallback.dispose()
        waitHandleCallback.dispose()
    }

    async run(){
        const self = this;
        try{
            const result = self.vm.evalCode(self.code);
            const promiseHandle = self.vm.unwrapResult(result)
            await self.vm.resolvePromise(promiseHandle)
            promiseHandle.dispose();
        } catch(e){
            console.log(e);
            self.outputFunc.forEach(x => x({value:'Syntax error', error:true}));
        }
    }

    getOutput(x){
        (x && this.outputFunc.push(x));
    }

    setInput(input){
        this.input = input;
    }
} 