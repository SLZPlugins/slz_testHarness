console.log(`

 ____  __    ____    ____   __   __ _  ____  ____   __  _  _ 
/ ___)(  )  (__  )  / ___) / _\\ (  ( \\(    \\(  _ \\ /  \\( \\/ )
\\___ \\/ (_/\\ / _/   \\___ \\/    \\/    / ) D ( ) _ ((  O ))  ( 
(____/\\____/(____)  (____/\\_/\\_/\\_)__)(____/(____/ \\__/(_/\\_)  
 `)


function Sandbox() {
    this.spies = []
    this.stubs = []
}

Sandbox.prototype.spy = function (obj, func) {
    let spy = new slz_Spy(obj, func)

    this.spies.push(spy)
    return spy
}

Sandbox.prototype.stub = function (obj, func) {
    let stub = new slz_Stub(obj, func)

    this.stubs.push(stub)
    return stub
}

Sandbox.prototype.reset = function () {
    this.spies.forEach(a => a.reset())
    this.stubs.forEach(a => a.reset())
}


/*    ========================================================================
            slz_Spy 
            Meant to spy specifically on Methods
      ========================================================================    */

function slz_Spy(obj, func) {
    this.callCount = 0;
    this.calledArgs = [];
    this.obj = func ? obj : window;
    this.func = func ? func : obj.__proto__.constructor.name;

    this.wrap()
}

slz_Spy.prototype.wrap = function () {
    let obj = this.obj;
    let func = this.func;
    let f = obj[func]

    let wrapper = (...args) => {

        this.callCount++
        this.calledArgs.push(args)

        return f.apply(obj, args)
    }

    obj[func] = wrapper;

}

slz_Spy.prototype.called = function () {
    return this.callCount > 0
}

slz_Spy.prototype.calledAtLeastNTimes = function (num) {
    return this.callCount >= num
}

slz_Spy.prototype.calledExactlyNTimes = function (num) {
    return this.callCount == num
}

slz_Spy.prototype.getCallCount = function (args) {
    let list = this.calledArgs;
    let currentArgList;
    let length = list.length;
    let count = 0;

    args.sort((a, b) => a.toString().localeCompare(b.toString()))
    for (let i = 0; i < length; i++) {
        currentArgList = list[i].clone()
        if (this.argsMatch(currentArgList, args))
            count++
    }

    return count
}

slz_Spy.prototype.calledWith = function (...args) {
    return this.getCallCount(args) > 0
}

slz_Spy.prototype.calledAtLeastNTimesWith = function (num, ...args) {
    return this.getCallCount(args) >= num
}

slz_Spy.prototype.calledExactlyNTimesWith = function (num, ...args) {
    return this.getCallCount(args) == num
}

slz_Spy.prototype.argsMatch = function (argsA, argsB) {
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

slz_Spy.prototype.reset = function () {
    this.callCount = 0;
    this.calledArgs = [];
}


/*    ========================================================================
            slz_Stub
      ========================================================================    */

function slz_Stub(obj, func) {
    this.obj = obj;
    this.func = func;
    this.stub = {};
    this.mockedFunctions = [];
    this.onMethod;
    this.onArgs;
    this.onMockedFunction;

    this.generateStub()
}

slz_Stub.generateStub = function () {
    if (this.func)
        this.stubFunction()
    else
        this.stubObject()
}

slz_Stub.stubObject = function () {
    this.stubAllProps()
    this.stubAllFunctions()
}

slz_Stub.stubAllProps = function () {
    let stub = this.stub;
    let obj = this.obj;
    let keys = Object.keys(obj)
    let vals = Object.values(obj)
    let length = keys.length;

    for (let i = 0; i < length; i++) {
        stub[keys[i]] = vals[i]
    }


}

slz_Stub.stubAllFunctions = function () {
    let stub = this.stub;
    let obj = this.obj;
    let funcNames = this.getAllFunctionNames()
    let length = funcNames.length;

    for (let i = 0; i < length; i++) {
        stub[funcNames[i]] = (...args) => { this.mockFunction.call(this, funcNames[i], args) }
    }

}

slz_Stub.getAllFunctionNames = function () {
    return standardPlayer.sp_Core.getAllFunctionNames(this.obj)

}

slz_Stub.stubFunction = function () {
    this.stub[this.func] = () => { }
}

slz_Stub.getMockedFunction = function (name) {
    let list = this.mockedFunctions;
    let length = list.length;
    let newMockedFunction;

    this.onArgs = []
    for (let i = 0; i < length; i++) {
        if (list[i].methodName == name) {
            this.onMockedFunction = list[i]
            return list[i]
        }

    }

    newMockedFunction = new Mock_Function(this, name)
    this.mockedFunctions.push(newMockedFunction)
    this.onMockedFunction = newMockedFunction

    return newMockedFunction;

}

slz_Stub.on = function (method) {
    this.onMethod = method
    this.getMockedFunction(method)
    return this
}

slz_Stub.with = function (...args) {
    this.onArgs = args;
    return this
}

slz_Stub.then = function (f) {
    let args = this.onArgs;
    let mockedFunction = this.onMockedFunction;

    mockedFunction.addFunction(f, args)

}

slz_Stub.mockFunction = function (thisFunctionName, args) {
    let mock = this.getMockedFunction(thisFunctionName)
    let f = mock.getRunnableFunction(args)[0]


    f.apply(this.stub, args)


}

slz_Stub.reset = function () {
    this.mockedFunctions.forEach(a => {
        a = undefined
    })

    this.mockedFunctions = [];
}



function Mock_Function(self, methodName) {
    this.args = []
    this.cb = []
    this.noArgsFunction = () => { console.log(`No args function invoked on ${this.methodName}, but a no args mock function was never defined`) }
    this.self = self;
    this.methodName = methodName
}

addFunction = function(f, args) {
    if (!args)
        return this.noArgsFunction = f;

    let storedFunction = this.hasTheseArgs(args);

    if (storedFunction != false)
        return this.cb[storedFunction[1]] = f

    this.cb.push(f)
    this.args.push(args)

}

hasTheseArgs = function(args) {
    let list = this.args;
    let length = list.length;

    for (let i = 0; i < length; i++) {
        if (standardPlayer.sp_Core.areEquivalent(list[i], args)) {
            return [this.cb[i], i]
        }
    }
    return false;
}

getRunnableFunction = function(args) {
    if (!args)
        return this.noArgsFunction

    let f = this.hasTheseArgs(args)

    if (f !== false) {
        return f
    }

    return [() => { }]

}

