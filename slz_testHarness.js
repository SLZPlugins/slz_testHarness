/*:
* @plugindesc SLZ standardplayer-Lanzy JS Test Harness for MV and MZ
* @author slz
* @target MZ
*
* @param tests
* @type struct<Module>
* @text Tests
* @desc Configure paths for Tests
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

slz_Harness.addBeforeAllTestHook = function(cb){
    let hasCb = this._beforeAllTestHooks.find(hook => hook.toString() == cb.toString()).length

    if(!hasCb){
        this._beforeAllTestHooks.push(cb)
    }
}

slz_Harness.addBeforeTestHook = function(cb){
    let hasCb = this._beforeTestHooks.find(hook => hook.toString() == cb.toString()).length

    if(!hasCb){
        this._beforeTestHooks.push(cb)
    }
}

slz_Harness.addAfterTestHook = function(cb){
    let hasCb = this._afterTestHooks.find(hook => hook.toString() == cb.toString()).length

    if(!hasCb){
        this._afterTestHooks.push(cb)
    }
}

slz_Harness.addafterAllTestHook = function(cb){
    let hasCb = this._afterAllTestHooks.find(hook => hook.toString() == cb.toString()).length

    if(!hasCb){
        this._afterAllTestHooks.push(cb)
    }
}

slz_Harness.addTest = function (data) {
    this._loadedTests.push(data.loadTestData)
}

slz_Harness.runAllLoadedTests = function () {
    this._selectedTests = this._loadedTests;
    this.runTests()
}

slz_Harness.runTests = function(){
    this.runTestHooks(this._beforeAllTestHooks)
    this._selectedTests.forEach(test => {
        test()
    })
    this.runTestHooks(this._afterAllTestHooks)
}

slz_Harness.runTest = function(test){
    this.runTestHooks(this._beforeTestHooks)
    test()
    this.runTestHooks(this._afterTestHooks)
}

slz_Harness.runTestHooks = function(hooks){
    hooks.forEach(hook => hook())
}

slz_Harness.addMissingResource = function(type, requirer, assetName){
    this._missingModule.push(
        {
            type: type,
            requirer: requirer,
            resourceName: assetName
        }
    )

    this._hasError = true;
}

slz_Harness.registerModule = function(name){
    if(!this.hasModule(name)){
        console.log(name)
        this._loadedModules.push({name:name})
    }
}

slz_Harness.hasModule = function (name) {
    return this._loadedModules.filter(module => {
        module.name == name
    }).length ? true : false

    
}

slz_Harness.hasPlugin = function(name) {
    return $plugins.find(plugin => {
        plugin.name == name
    }).length ? true : falses
}


slz_Harness.requirePlugin = function (requirer, rmPluginName) {
    if (!this.hasPlugin(rmPluginName)) {
        this.addMissingResource('rmPlugin', requirer, rmPluginName)
    }
}

slz_Harness.requireModule = function(requirer, moduleName){
    if(!this.hasModule(moduleName)){
        this.addMissingResource('module', requirer, moduleName)
    }
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
    this._modules = []
    this._pathPrefix = "js/"
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
    let result = this._scriptElements.find(element => {
        element._url === url
    })

    return result || false
}

slz_HarnessLoader.loadParameterModules = function (paramterObject) {
    let prefix = paramterObject.directory;
    let list = paramterObject.defaults;

    list.forEach(path => {
        this.load(`${prefix}/${path}`)
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
}

slz_TestLogger.log = function (data) {
    this.allLogs.push(data)
}

slz_TestLogger.clearLogs = function () {
    let allLogs = Array(...this.allLogs)

    this.allLogs = [];

    return allLogs
}









class slz_InterfaceEnforcedMethodError extends Error {
    constructor(c, methodName) {
        let message = `This is an interface enforced method. Classes exending ${Object.getPrototypeOf(c.constructor).name} must have their own implementation of ${methodName}`
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

class slz_modelValidationError extends Error {
    constructor(name) {
        let message = `No model supplied for ${name}`
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}








/* ///////////////////////////////////////////////////////////////////////////
        Interfaces
   /////////////////////////////////////////////////////////////////////////// */

class iTestModule {
    constructor(name, model) {
        //First arg should always be Official handle for module (eg rmAssert or sinot)
        //remaining args should b
        this.name = name || false;
        this.model = model || {}
        this._isValid = [];
        this.validate()
    }

    validate() {
        let validName = typeof this.name == 'string' && this.name && this.name.length
        let validModel = this.validateModel()

        this._isValid.push(validName && validModel ? true : false)
    }

    validateModel() {
        let hasInstall = typeof this.model.install == 'function'
        let hasUninstall = typeof this.model.uninstall == 'function'

        return hasInstall && hasUninstall
    }

    isValid() {
        this._isValid.filter(element => element).length == this._isValid.length;
    }
}


class iTestLanguage extends iTestModule {
    constructor(name, model) {
        super(name, model)
    }

    validate() {
        let validTestRunner = typeof this.model.runTest == 'function'

        super.validate()

        this._isValid.push(validTestRunner ? true : false)
    }

}


class iReporter extends iTestModule {
    constructor(name, model) {
        super(name, model)
    }

    print() {
        throw new slz_InterfaceEnforcedMethodError(this, 'print')
    }

    createReport() {
        throw new slz_InterfaceEnforcedMethodError(this, 'createReport')
    }
}

class iReport extends iTestModule {
    constructor(name, model) {
        super(name, model)
    }

    print() {
        throw new slz_InterfaceEnforcedMethodError(this, 'print')
    }
}

/*
============================================================================================================================================
============================================================================================================================================
============================================================================================================================================
*/
slz_Harness.initialize()








class testClass extends iReporter {
    constructor(name, model) {
        super(name, model)
    }
}