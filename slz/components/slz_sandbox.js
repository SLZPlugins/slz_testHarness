class Sandbox {
    spies = []
    stubs = []

    spy(obj, func) {
        let spy = new slz_Spy(obj, func)

        this.spies.push(spy)
        return spy
    }

    stub(obj, func) {
        let stub = new slz_Stub(obj, func)

        this.stubs.push(stub)
        return stub
    }

    reset() {
        this.spies.forEach(a => a.reset())
        this.stubs.forEach(a => a.reset())
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
    mockedFunctions = [];
    onMethod;
    onArgs;
    onMockedFunction;

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

    stubObject() {
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

        for (let i = 0; i < length; i++) {
            stub[funcNames[i]] = (...args) => { this.mockFunction.call(this, funcNames[i], args) }
        }

    }

    getAllFunctionNames() {
        return standardPlayer.sp_Core.getAllFunctionNames(this.obj)

    }

    stubFunction() {
        this.stub[this.func] = () => { }
    }

    getMockedFunction(name){
        let list = this.mockedFunctions;
        let length = list.length;
        let newMockedFunction;

        this.onArgs = []
        for(let i = 0; i < length; i++){
            if(list[i].methodName == name){
                this.onMockedFunction = list[i]
                return list[i]
            }
                
        }

        newMockedFunction = new Mock_Function(this, name)
        this.mockedFunctions.push(newMockedFunction)
        this.onMockedFunction = newMockedFunction
        
        return newMockedFunction;
        
    }

    on(method) {
        this.onMethod = method
        this.getMockedFunction(method)
        return this
    }

    with(...args) {
        this.onArgs = args;
        return this
    }

    then(f) {
        let args = this.onArgs;
        let mockedFunction = this.onMockedFunction;

        mockedFunction.addFunction(f, args)
        
    }

    mockFunction(thisFunctionName, args) {
        let mock = this.getMockedFunction(thisFunctionName)
        let f = mock.getRunnableFunction(args)[0]

        
        f.apply(this.stub, args)


    }

    reset() {
        this.mockedFunctions.forEach(a => {
            a = undefined
        })

        this.mockedFunctions = [];
    }

}

class Mock_Function {
    self;
    methodName = "";
    args = []
    cb = []
    noArgsFunction = () => { console.log(`No args function invoked on ${this.methodName}, but a no args mock function was never defined`) }

    constructor(self, methodName) {
        this.self = self;
        this.methodName = methodName
    }

    addFunction(f, args) {
        if (!args)
            return this.noArgsFunction = f;

        let storedFunction = this.hasTheseArgs(args);

        if (storedFunction != false)
            return this.cb[storedFunction[1]] = f

        this.cb.push(f)
        this.args.push(args)

    }

    hasTheseArgs(args) {
        let list = this.args;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            console.log(list[i], args)
            if (standardPlayer.sp_Core.areEquivalent(list[i], args)) {
                return [this.cb[i], i]
            }
        }
        return false;
    }

    getRunnableFunction(args) {
        if (!args)
            return this.noArgsFunction

        let f = this.hasTheseArgs(args)

        if (f !== false) {
            return f
        }

        return [() => {}]

    }
}




console.log('****Loading slz_Sandbox to slz_sandbox class****')

window.slz_sandbox = Sandbox

