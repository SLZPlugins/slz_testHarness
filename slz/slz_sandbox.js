class Sandbox {
    spies = []
    stubs = []

    spy(obj, func) {
        let spy = new slz_Spy(obj, func)

        this.spies.push(spy)
        return spy
    }

    stub(obj, args) {
        let stub = new slz_Stub(obj, args)

        this.stubs.push(stub)
        return stub
    }

    reset() {
        this.spies.forEach(a => a.reset())
    }
}

/*    ========================================================================
            slz_Spy 
            Meant to spy specifically on Methods
      ========================================================================    */

class slz_Spy {
    callCount = 0;
    calledArgs = [];
    constructor(obj, func) {
        this.obj = func ? obj : window;
        this.func = func ? func : obj.__proto__.constructor.name;

        this.wrap()
    }

    wrap() {
        let obj = this.obj;
        let func = this.func;
        let f = obj[func]

        let wrapper = (...args) => {

            this.callCount++
            this.calledArgs.push(args)
            console.log(this)
            console.log(f)
            return f.apply(obj, args)
        }

        obj[func] = wrapper;

    }

    called() {
        return this.callCount > 0
    }

    calledAtLeastNTimes(num) {
        return this.callCount >= num
    }

    calledExactlyNTimes(num) {
        return this.callCount == num
    }

    getCallCount(args) {
        let list = this.calledArgs;
        let currentArgList;
        let length = list.length;
        let count = 0;

        console.log(args)
        args.sort((a, b) => a.toString().localeCompare(b.toString()))
        for (let i = 0; i < length; i++) {
            currentArgList = list[i].clone()
            if (this.argsMatch(currentArgList, args))
                count++
        }

        return count
    }

    calledWith(...args) {
        return this.getCallCount(args) > 0
    }

    calledAtLeastNTimesWith(num, ...args) {
        return this.getCallCount(args) >= num
    }

    calledExactlyNTimesWith(num, ...args) {
        return this.getCallCount(args) == num
    }

    argsMatch(argsA, argsB) {
        argsA.sort((a, b) => a.toString().localeCompare(b.toString()))

        let baseMatch = argsA === argsB;
        let baseNoMatch = argsA == null || argsB == null || argsA.length !== argsB.length;

        if (baseMatch)
            return true

        if (baseNoMatch)
            return false

        for (let i = 0; i < argsA.length; i++) {
            if (argsA[i] !== argsB[i])
                return false
        }

        return true;

    }

    reset() {
        this.callCount = 0;
        this.calledArgs = [];
    }


}

/*    ========================================================================
            slz_Stub
      ========================================================================    */

class slz_Stub {
    stub = {};
    cbs = [];
    onMethod;
    onArgs;

    constructor(obj, func) {
        this.obj = obj;
        this.func = func;

        this.generateStub()
    }

    generateStub() {
        if (this.func)
            this.stubFunction()
        else
            this.stubObject()
    }

    stubObject(){
        this.stubAllProps()
        this.stubAllFunctions()
    }

    stubAllProps() {
        let stub = this.stub;
        let obj = this.obj;
        let keys = Object.keys(obj)
        let vals = Object.values(obj)
        let length = keys.length;

        for (let i = 0; i < length; i++) {
            stub[keys[i]] = vals[i]
        }


    }

    stubAllFunctions() {
        let stub = this.stub;
        let obj = this.obj;
        let funcNames = this.getAllFunctionNames()
        let length = funcNames.length;

        for(let i = 0; i < length; i++){
            stub[funcNames[i]] = (...args)=>{this.mockFunction.call(this, funcNames[i], args)}
        }
        
    }

    getAllFunctionNames() {
        let props = new Set()
        let obj = this.obj
        let currentObj = obj

        do {
            Object.getOwnPropertyNames(currentObj).map(item => props.add(item))
        } while ((currentObj = Object.getPrototypeOf(currentObj)))
        return [...props.keys()].filter(item => typeof obj[item] === 'function')

    }

    stubFunction() {
        this.stub[this.func] = () => { }
    }

    on(method){
        this.onMethod = method
        this.onArgs = [];
        return this
    }

    with(...args){
        this.onArgs = args;
        return this
    }

    then(f){
        let args = this.onArgs;
        let name = args.length ? this.onMethod + JSON.stringify(args.reduce((a, b) => a.toString() + b.toString()).toString().replaceAll(" ","")) : this.onMethod
        console.log(name)
        if(name == this.onMethod){
            console.log(name)
            name = `MOCK${name}`;
        }

        this.stub[name] = f
    }
    

    mockFunction(thisFunctionName, args){
        let name = thisFunctionName;
        if(args && args.length){
            name += JSON.stringify(args.reduce((a, b) => a.toString() + b.toString()).toString().replaceAll(" ",""))
        } else {
            if(!this.stub[`MOCK${name}`]){
                console.log('runnning no args for first time')
                this.stub[`MOCK${name}`] = ()=>{}
            }

            return this.stub[`MOCK${name}`]()
        }
        
        if(this.stub[name]){
            this.stub[name]()
        }
    }

}


console.log('****Loading slz_Sandbox to slz_sandbox class****')

window.slz_sandbox = Sandbox

