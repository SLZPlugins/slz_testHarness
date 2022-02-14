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
* @default {"directory":"js/plugins/slz/components","defaults":"[\"slz_sandbox.js\"]"}
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
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};

/* ///////////////////////////////////////////////////////////////////////////
        Global Functions global scenario describe
   /////////////////////////////////////////////////////////////////////////// */


function requireDependency(names) {

}

function requireLanaguage(...names) {
    //Language specific operations/assignment
    names.forEach(dependency =>
        this.requireDependency(dependency)
    )

}

function requireEngine(...names) {
    //Engine specific operations/assignment
    names.forEach(dependency =>
        this.requireDependency(dependency)
    )

}

function requireComponent(...names) {
    //Component specific operations/assignment
    names.forEach(dependency =>
        this.requireDependency(dependency)
    )

}


function registerDependency(model, data) {
    let list = Object.keys(data);
    let length = list.length;

    console.log('calling register dependency on ' + model.name)
    if (HarnessFileManager.globalElementNames.contains(model.name))
        return

    window[model.name] = {model:model}
    
    for (let i = 0; i < length; i++) {
        window[list[i]] = data[list[i]]
    }

    HarnessFileManager.addGlobalElement(model.name, data)
}

function registerLanguage(name, data) {
    //Language specific operations/assignment

    this.registerDependency(name, data)
}

function registerEngine(name, data) {
    //Engine specific operations/assignment

    this.registerDependency(name, data)
}

function registerComponent(name, data) {
    //Component specific operations/assignment

    this.registerDependency(name, data)
}

function registerReporter(name, data) {
    //Reporter specific operations/assignment

    this.registerDependency(name, data)
}

function slzRegistrationError(data) {
    console.log(`Error registering Module: ${data.name}`)
    console.log(data)
}

class slz_DependencyError {

    constructor(){
        throw new Error('This is an absract class, classes that extend this class must implement a constructor method')
    }

    print(){
        console.log(this.data)
    }
}

class slz_TestModuleDefinitionError extends slz_DependencyError{

    constructor(data){
        this.data = data
    }

    printError(){
        
        this.print()
    }
}

class slz_LanguageModuleDefinitionError extends slz_DependencyError{

    constructor(data){
        this.data = data
    }

    printError(){
        console.log(`Missing defintion: ${data.definition}`)
        this.print()
    }
}

class slz_EngineModuleDefinitionError extends slz_DependencyError{

    constructor(data){
        this.data = data
    }

    printError(){
        console.log(`Missing defintion: ${data.definition}`)
        this.print()
    }
}

class slz_ComponentModuleDefinitionError extends slz_DependencyError{

    constructor(data){
        this.data = data
    }

    printError(){
        console.log(`Missing defintion: ${data.definition}`)
        this.print()
    }
}




/* ///////////////////////////////////////////////////////////////////////////
        Test Runner  Runner tr
   /////////////////////////////////////////////////////////////////////////// */

class TestRunner {
    static tests = []
    static language

    constructor() {
        throw new Error('This is a static class')
    }

    static addTest(test) {

    }

    static setTestLanguage() {

    }

    static initialize() {
        this.setTestLanguage()
    }

    static run() {

    }

    static runTest(index) {

    }

    static runAllTests() {

    }

    static onComplete() {

    }

}

/* ///////////////////////////////////////////////////////////////////////////
        HarnessReporter #rp #report
   /////////////////////////////////////////////////////////////////////////// */

    class HarnessReporter {

        constructor(){
            throw new Error('This is a static class')
        }

        static aggregateReporters(){
            return "Still need to create aggregateReporters"
        }
    }

    Object.defineProperty(HarnessReporter, "reporter", {
        get() {
            return HarnessReporter.aggregateReporters()
        }
    })


/* ///////////////////////////////////////////////////////////////////////////
        HarnessFileManager  #fm #file #manager
   /////////////////////////////////////////////////////////////////////////// */

class HarnessFileManager {
    static locations = standardPlayer.sp_Core.fullUnpack(PluginManager.parameters('slz_testHarness'));
    static missingDependency = [];
    static testFiles = []
    static languageFiles = []
    static engineFiles = []
    static componentFiles = []
    static reporterFiles = []
    static globalElementNames = []
    static globalElementManifests = []

    constructor() {
        throw new Error('This is a static class. Stop trying to instantiate everything')
    }


    static getTestFileNames() {
        this.defaultTestFiles = this.getFileNames(this.locations.tests)
    }

    static getLanguageFileNames() {
        this.languageFiles = this.getFileNames(this.locations.languages)
    }

    static getEngineFileNames() {
        this.engineFiles = this.getFileNames(this.locations.engines)
    }

    static getComponentFileNames() {
        this.componentFiles = this.getFileNames(this.locations.components)
    }

    static getFileNames(list) {
        let results = [];
        let length = list.length;

        for(let i = 0; i < length; i++){
            results = results.concat(standardPlayer.sp_Core.findFilesInDir(true, list[i].directory))
        }

            
        return results
    }

    static defaultFiles(name){
        console.log(this.locations[name])
        let list = this.locations[name].defaults;
        let length = list.length;
        let result = [];
        let prefix = this.locations[name].directory + "/"
        for(let i = 0; i < length; i++){
            result.push(prefix + list[i])
        }

        return result
    }


    static addGlobalElement(name, data) {
        this.globalElementNames.push(name)
        this.globalElementManifests.push(data)
    }


    static readAllFileNames() {
        this.getTestFileNames()
        this.getLanguageFileNames()
        this.getEngineFileNames()
        this.getComponentFileNames()
    }

    static unloadGlobalElements(){
        let names = this.globalElementNames;
        let manifests = this.globalElementManifests;

        let namesLength = names.length;
        let manifest,
            manifestLength

        for(let i = 0; i < namesLength; i++){
            console.log(manifests)
            manifest = Object.keys(manifests[i])
            console.log(manifest)
            manifestLength = manifest.length;

            window[names[i]] = undefined
            delete window[names[i]]

            for(let j = 0; j < manifestLength; j++){
                window[manifest[j]] = undefined
                delete window[manifest[j]]
            }
        }
    }

}

/* ///////////////////////////////////////////////////////////////////////////
        HarnessLoader  hl loader
   /////////////////////////////////////////////////////////////////////////// */

class HarnessLoader {
    static manifest = [];
    static loading = false;
    static runOnComplete = false;

    constructor() {
        throw new Error('This is a static class')
    }

    static createFullManifest() {
        let fm = this.fm();
        let tests = fm.defaultFiles('tests')
        let engines = fm.defaultFiles('engines')
        let components = fm.defaultFiles('components')
        let languages = fm.defaultFiles('languages')
        let list = languages.concat(engines.concat(components.concat(tests)))
        let length = list.length;
        let manifest = [];


        for (let i = 0; i < length; i++) {
            console.log(list[i])
            manifest.push(
                () => {
                    this.loadFile(list[i])
                }
            )
        }

        return manifest
    }


    static load() {        
        this.loading = true;
        this.manifest = this.createFullManifest()

        console.log(this.manifest)
        if (this.manifest.length)
            this.manifest.shift()()

    }

    static continue() {
        if (this.manifest.length) { //if there is more to run
            this.manifest.shift()()
        } else { //if you are finished loading altogether
            this.loading = false;
            this.onComplete()
        }
    }

    static onComplete() {
        // this.fm().checkAllDependencies()

        if (!this.runOnComplete)
            return

        this.runOnComplete = false;
        TestRunner.runAllTests();
    }

    static onError(error, name) {
        console.log('Error loading file ' + name)
        console.log(error)
    }

    static fm() {
        return HarnessFileManager
    }


    static loadFile(filePath) {
        console.log(filePath)
        standardPlayer.sp_Core.loadFile(filePath, ()=>{this.continue()}, (error, name)=>{this.onError(error, name)})
    }
}
