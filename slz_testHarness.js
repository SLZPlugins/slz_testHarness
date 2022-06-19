/*:
* @plugindesc SLZ standardplayer-Lanzy JS Test Harness for MV and MZ
* @author slz
* @target MZ
*
* @param tests
* @type struct<Module>
* @text Tests
* @desc Configure paths for Tests/
* @default {"directory":"js/plugins/slz/tests","defaults":"[\"test1.js\"]"}
* 
* @param languages
* @type struct<Module>
* @text Languages
* @desc Configure paths for Language Modules
* @default {"directory":"js/plugins/slz/languages","defaults":"[\"slz_Sinot.js\"]"}
* 
* @param engines
* @type struct<Module>
* @text Engines
* @desc Configure paths for Engine Modules
* @default {"directory":"js/plugins/slz/engines","defaults":"[\"slz_rmAssert.js\"]"}
*
* @param components
* @type struct<Module>
* @text Components
* @desc Configure paths for Component Modules
* @default {"directory":"js/plugins/slz/components","defaults":"[\"slz_sandbox.js\",\"slz_tellon.js\"]"}
*/

/*~struct~Module:
 * 
 * @param directory
 * @type text
 * @text Main Directory
 * @desc Folder location for this type of module. 
 * @default js/slz/
 * 
 * @param defaults
 * @type text[]
 * @text Default Module Files
 * @desc List of Files to load by default. 
 * @default []
 * 
 * 
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};

slz.testHarness.parameters = standardPlayer.sp_Core.fullUnpack(PluginManager.parameters('slz_TestHarness'));

/* ///////////////////////////////////////////////////////////////////////////
        Harness
   /////////////////////////////////////////////////////////////////////////// */

class slz_Harness {
    constructor() {
        throw new Error('This is a static class')
    }
}

slz_Harness.initialize = function () {
    this.createHarnessClassRefs()
    this.createStandardProps()
    this.createHooks()
}

slz_Harness.createHarnessClassRefs = function () {
    this.loader = slz_HarnessLoader.initialize()
    this.logger = slz_TestLogger.initialize()
}

slz_Harness.createStandardProps = function () {
    this._missingResources = [];
    this._hasError = false;
    this._loadedModules = [];
    this._loadedTests = [];
    this._selectedTests = [];
}

slz_Harness.createHooks = function(){
    this._beforeAllTestHooks = []
    this._beforeTestHooks = []
    this._afterTestHooks = []
    this._afterAllTestHooks = []
}

slz_Harness.addCbToHookArr = function(hookArr, cb) {
    if(!hookArr.find(hook => hook.toString() === cb.toString())) {
        hookArr.push(cb);
    }
}

slz_Harness.addBeforeAllTestHook = function(cb) {
    this.addCbToHookArr(this._beforeAllTestHooks, cb);
}

slz_Harness.addAfterTestHook = function(cb) {
    this.addCbToHookArr(this._afterTestHooks, cb);
}

slz_Harness.addafterAllTestHook = function(cb) {
    this.addCbToHookArr(this._afterAllTestHooks, cb);
}

slz_Harness.addafterAllTestHook = function(cb) {
    this.addCbToHookArr(this._afterAllTestHooks, cb);
}

slz_Harness.addTest = function(data) {
    try{
        data.validate()
        if(data.isValid()){
            this._loadedTests.push(data)
        }
    } catch(e){
        console.log(e)
    }    
}

slz_Harness.execute = function (testIndex) {   //<-- should/could accept test running params
    console.log(testIndex)
    let tests = typeof testIndex == 'undefined' ? this._loadedTests : [this._loadedTests[testIndex]]
    if (this._hasError) {
       console.log(this.errorMessage()); 
       return;
    }

    this.logger.indexLogsForNewTest()
    this._selectedTests = tests; //<-- should be replaced or this should be default value
    this.runAllTests()
}

slz_Harness.runAllTests = function() {
    this.runTestHooks(this._beforeAllTestHooks);
    this._selectedTests.forEach(test => {
        this.runTest(test)
    })
    this.runTestHooks(this._afterAllTestHooks)
}

slz_Harness.runTest = function(test) {
    this.runTestHooks(this._beforeTestHooks)
    test.testRunner(test.loadTestData())
    this.runTestHooks(this._afterTestHooks)
}

slz_Harness.runTestHooks = function(hooks) {
    hooks.forEach(hook => hook())
}

slz_Harness.addMissingResource = function(type, requirer, assetName){
    this._missingResources.push(
        {
            type: type,
            requirer: requirer,
            resourceName: assetName
        }
    )

    this._hasError = true;
}

slz_Harness.registerModule = function(name) {
    if (!this.hasModule(name)) {
        console.log(name)
        this._loadedModules.push({name:name})
    }
}

slz_Harness.hasModule = function(name) {
    return this._loadedModules.filter(module => {
        module.name == name
    }).length > 0;    
}

slz_Harness.hasPlugin = function(name) {
    return $plugins.find(plugin => {
        plugin.name == name
    }).length > 0;
}

slz_Harness.requirePlugin = function(requirer, rmPluginName) {
    if (!this.hasPlugin(rmPluginName)) {
        this.addMissingResource('RM Plugin', requirer, rmPluginName)
    }
}

slz_Harness.requireModule = function(requirer, moduleName) {
    if(!this.hasModule(moduleName)){
        this.addMissingResource('Harness Module', requirer, moduleName)
    }
}   

slz_Harness.errorMessage = function() {
    console.log('Unable to run tests, because of the following missing resources: ')
    console.log(this.printMissingResources())
}

slz_Harness.printMissingResources = function(){
    let list = this._missingResources;
    let length = list.length;
    let message = "";

    for (let i = 0; i < length; i++) {
        message += 
    message += 
        message += 
        `        Type: ${list[i].type}
        Resource: ${list[i].resourceName}
        Required By: ${list[i].requirer}
        `
    }

    return message
}


/* ///////////////////////////////////////////////////////////////////////////
        Loader
   /////////////////////////////////////////////////////////////////////////// */

class slz_HarnessLoader {
    constructor() {
        throw new Error('This is a static class')
    }
}

slz_HarnessLoader.initialize = function () {
    this.createStandardProps()
    this.loadAllParameterModules()

    return this
}

slz_HarnessLoader.createStandardProps = function () {
    this._scriptElements = [];
    this._modules = [];
    this._pathPrefix = "js/";
}

slz_HarnessLoader.load = function (path) {
    let url = this._pathPrefix + path.replace(this._pathPrefix, '');

    if (!this.fileAlreadyLoaded(url)) {
        this.loadScript(url)
    }
}

slz_HarnessLoader.loadScript = function (url) {

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = () => { console.log('Error loading script') }
    script._url = url;
    document.body.appendChild(script);

    this._scriptElements.push(script)
};

slz_HarnessLoader.fileAlreadyLoaded = function (url) {
    return this._scriptElements.filter(element => {
        element._url === url;
    }).length > 0;
}

slz_HarnessLoader.loadParameterModules = function (parameterObject) {
    let prefix = parameterObject.directory;
    let list = parameterObject.defaults;

    list.forEach(path => {
        this.load(`${prefix}/${path}`);
    })
}

slz_HarnessLoader.loadAllParameterModules = function () {
    this.loadParameterModules(slz.testHarness.parameters.languages)
    this.loadParameterModules(slz.testHarness.parameters.engines)
    this.loadParameterModules(slz.testHarness.parameters.components)
    this.loadParameterModules(slz.testHarness.parameters.tests)
}

/* ///////////////////////////////////////////////////////////////////////////
        logger
   /////////////////////////////////////////////////////////////////////////// */

class slz_TestLogger {
    constructor() {
        throw new Error('This is a static class')
    }
}

slz_TestLogger.initialize = function () {
    this.createStandardProps()

    return this
}

slz_TestLogger.createStandardProps = function () {
    this.allLogs = [];
    this.logIndexes = [];
    this._testRuns = 0;
}

slz_TestLogger.addLog = function(type, message) {
    let record = new slz_LogRecord(type, message)

    this.allLogs.push(record)

    return record
}

slz_TestLogger.log = function (message) {
    return this.addLog('LOG', message);
}

slz_TestLogger.info = function (module, message) {
    return this.addLog(module, message);
}

slz_TestLogger.addAssertion = function(...args) {
    this.allLogs.push(new slz_AssertionRecord(...args));
}


slz_TestLogger.clearLogs = function() {
    let allLogs = Array(...this.allLogs);

    this.createStandardProps();

    return allLogs
}

slz_TestLogger.indexLogsForNewTest = function() {
    this._testRuns++;
    this.logIndexes.push(this.allLogs.length);
}

slz_TestLogger.getLastTestRunLogs = function(includeLogMessages){
    let indexes = this.logIndexes
    let start = this._testRuns > 1 ? indexes[this._testRuns - 1] : 0
    let end = this._testRuns > 1 ? indexes[this._testRuns] : this.allLogs.length;
    let slicedLogs = this.allLogs.slice(start, end)

    if(includeLogMessages){
        return slicedLogs
    } else {
        console.log(slicedLogs)
        return slicedLogs.filter(record => {
            return record.level != 'LOG'
        })
    }
}


/* ///////////////////////////////////////////////////////////////////////////
        TestRecord
   /////////////////////////////////////////////////////////////////////////// */

   class slz_TestRecord {
        constructor(module){
            this.module = module
            this.setStandardProps()
        }

        setStandardProps(){
            this.depth = 0;
            this.level = null;
            this.index = slz_Harness.logger.allLogs.length;
        }

        setModule(module){
            this.module = module
    
            return this
        }
    
        setLevel(level){
            this.level = level
    
            return this
        }
    
        setDepth(depth){
            this.depth = depth;
            
            return this
        }
   }


/* ///////////////////////////////////////////////////////////////////////////
        LogRecord
   /////////////////////////////////////////////////////////////////////////// */


class slz_LogRecord extends slz_TestRecord {
    constructor(module, text){
        super(module)
        this.text = text;
    }

    setStandardProps(){
        super.setStandardProps()
        this.level = 'LOG'
    }

    setText(text){
        this.text = text;
        
        return this
    }

    toString(){
        return this.text
    }

}

/* ///////////////////////////////////////////////////////////////////////////
        AssertionRecord
   /////////////////////////////////////////////////////////////////////////// */

class slz_AssertionRecord extends slz_TestRecord{

    constructor(module, isPassing, expected, actual, dataString) {
        super(module)
        this.isPassing = isPassing;
        this.expected = expected;
        this.actual = actual;
        this.dataString = dataString;
    }

    setStandardProps() {
        this.level = 'ASSERTION'
        this.depth = -1
    }

    toString(prefix, suffix) {
        this.prefix = prefix || '';
        this.suffix = suffix || '';
       return `${this.prefix}Expected: ${this.expected}${this.suffix}\n${this.prefix}Actual: ${this.actual}${this.suffix}`
    }
}

/* ///////////////////////////////////////////////////////////////////////////
        Error Classes
   /////////////////////////////////////////////////////////////////////////// */

class slz_ErrorBaseClass extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

class slz_InterfaceEnforcedMethodError extends slz_ErrorBaseClass {
    constructor(c, methodName) {
        let message = `This is an interface enforced method. Classes exending ${Object.getPrototypeOf(c.constructor).name} must have their own implementation of ${methodName}`
        super(message);
    }
}

/* ///////////////////////////////////////////////////////////////////////////
        Interfaces
   /////////////////////////////////////////////////////////////////////////// */

class iTestModule {
    constructor() {
        this._isValid = [];
    }

    validate() {
        throw new slz_InterfaceEnforcedMethodError(this, 'validate')
    }


    isValid() {
        return this._isValid.filter(element => element).length == this._isValid.length;
    }
}

class iTestLanguage extends iTestModule {
    constructor() {
        super()
    }

    validate() {
        this._isValid.push(this.isValidTestLanguage());
    }

    isValidTestLanguage(){
        let hasTitle = typeof this.title == 'string'
        let hasTestRunner = typeof this.testRunner == 'function'
        let hasLoadTestData = typeof this.loadTestData == 'function'

        return hasTitle && hasTestRunner && hasLoadTestData
    }

    loadTestRunner() {
        this.testRunner(this.loadTestData());
    }
}

/*
============================================================================================================================================
============================================================================================================================================
============================================================================================================================================
*/
slz_Harness.initialize()
