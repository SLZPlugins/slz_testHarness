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
 * 
 * 
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};

/* ///////////////////////////////////////////////////////////////////////////
        Global Functions global scenario describe
   /////////////////////////////////////////////////////////////////////////// */


function requireDependency(dependency) {
    if(!HarnessFileManager.hasDependency(dependency)){
        console.log('MISSING DEPENDENCY: ' + dependency)
        return false
    }
    return HarnessFileManager.getModel(dependency)
}

function requireLanguage(dependency) {
    //Language specific operations/assignment
        let requiredLanguage = this.requireDependency(dependency)
        console.log(requiredLanguage)
        TestRunner.setTestLanguage(requiredLanguage)
    

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


function registerDependency(model, manifest) {
    let list = Object.keys(manifest);
    let length = list.length;

    console.log('calling register dependency on ' + model.name)
    if (HarnessFileManager.globalElementNames.contains(model.name))
        return

    window[model.name] = { model: model }

    for (let i = 0; i < length; i++) {
        window[list[i]] = manifest[list[i]]
    }

    HarnessFileManager.addGlobalElement(model.name, manifest)
}

function registerLanguage(model, manifest) {
    //Language specific operations/assignment

    this.registerDependency(model, manifest)
}

function registerEngine(model, manifest) {
    //Engine specific operations/assignment

    this.registerDependency(model, manifest)
}

function registerComponent(model, manifest) {
    //Component specific operations/assignment

    this.registerDependency(model, manifest)
}

function registerReporter(model, manifest, reporter) {
    this.registerDependency(model, manifest)

    HarnessReporter.install(reporter, model)
}

function slzRegistrationError(data) {
    console.log(`Error registering Module: ${data.name}`)
    console.log(data)
}

class slz_DependencyError {
    data = { message: "" }
    constructor(name, method, type) {
        this.data.message = `${this.className} ${this.method} ${this.type}s extending ${className} must define their own`
    }

    print() {
        console.log(this.data.message)
    }
}

class slz_TestModuleDefinitionError extends slz_DependencyError {
    type = "Test"

    printError() {

        this.print()
    }
}

class slz_LanguageModuleDefinitionError extends slz_DependencyError {
    type = "Language"

    printError() {

        this.print()
    }
}

class slz_EngineModuleDefinitionError extends slz_DependencyError {
    type = "Engine"

    printError() {
        console.log(`Missing defintion: ${data.definition}`)
        this.print()
    }
}

class slz_ComponentModuleDefinitionError extends slz_DependencyError {
    type = "Component"

    printError() {
        console.log(`Missing defintion: ${data.definition}`)
        this.print()
    }
}




/* ///////////////////////////////////////////////////////////////////////////
        Test Runner  Runner tr
   /////////////////////////////////////////////////////////////////////////// */

class TestRunner {
    static tests = []
    static languages = []

    constructor() {
        throw new Error('This is a static class')
    }

    static addTest(test) {

    }

    static setTestLanguage(model) {
        console.log(model)
        this.languages.push(model.runTest)
        
        if(!model)
            this.stopTests = true;
    }


    static run() {
        this.languages = [];
        this.stopTests = false;
        this.runAllTests()
    }

    static runTest(index, test) {
        HarnessReporter.createReport()
        HarnessReporter.setHeading(test.title)
        this.languages[index](test.loadTestData())
    }

    static runAllTests() {
        let list = this.tests;
        let length = list.length;

        for(let i = 0; i < length; i++){
            this.runTest(i, list[i])
        }
    }

    static onComplete() {

    }

}

/* ///////////////////////////////////////////////////////////////////////////
        HarnessReporter #rp #hp #harness reporter
   /////////////////////////////////////////////////////////////////////////// */

class HarnessReporter {
    static reporterList = []
    static reporter;
    static harnessReports = [];
    static reports = [];
    static currentReport
    static heading = "";

    constructor() {
        console.log('HarnessReporter constructor on harness is a static class')
        throw new slz_ComponentModuleDefinitionError(
            'HarnessReporter', 'constructor', 'Reporter Classe'
        )
    }

    

    static install(reporter, model){
        this.reporterList.push(reporter)
        model.loadBanner()
    }

    

    static createReport(heading, ...args) {
        let list = this.reporterList
        let length = list.length;
        let called = false;
        let reports = [];

        for(let i = 0; i < length; i++){
            if(typeof list[i]['createReport'] === 'function'){
                reports.push[list[i].createReport(heading, args)]
                called = true;
            }
        }

        if(!called){
            reports = new HarnessReport(heading, args)
            this.harnessReports.push(reports)
            reports = [reports]
        }
            return reports
    }

    static addReport(reports, heading, data) {
        reports.forEach(a => {
            a.addReport(heading, data)
        })
    }

    static currentReports(){
        let list = this.reporterList;
        let length = list.length;
        let reports = [];

        for(let i = 0; i < length; i++){
            reports.push(list[i].currentReport())
        }

        return reports
    }

    static setHeading(heading){
        let reports = this.currentReports()

        reports.forEach(a => a.setHeading(heading))
    }

    print() {
        throw new slz_ComponentModuleDefinitionError(
            'HarnessReporter', 'print', 'Reporter Classe'
        )
    }

}




/* ///////////////////////////////////////////////////////////////////////////
        HarnessReport #rep #hr #report
   /////////////////////////////////////////////////////////////////////////// */

class HarnessReport {
    data;
    reports = [];
    heading = ""

    constructor(heading, data){
        this.heading = heading;
        this.data = data
    }

    addReport(heading, data){
        let report = new HarnessReport(heading, data)
        this.reports.push(report)

        return report
    }

    report(data){
        this.data = data;
    }

    setHeading(heading){
        this.heading = heading
    }

    print(){
        throw new slz_ComponentModuleDefinitionError(
            'HarnessReport', 'print', 'Report Classe'
        )
    }

    currentReport(){
        return this.reports.length ? 
                this.reports[this.reports.length - 1] :
                false;
    }

}

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


    static getModel(dependencyName){
        let list = this.globalElementNames
        let length = list.length;

        for(let i = 0; i < length; i++){
            if(list[i].toLocaleLowerCase() === dependencyName.toLocaleLowerCase()){
                return this.globalElementManifests[i]
            }
        }
        return false;
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

        for (let i = 0; i < length; i++) {
            results = results.concat(standardPlayer.sp_Core.findFilesInDir(true, list[i].directory))
        }


        return results
    }

    static defaultFiles(name) {
        console.log(this.locations[name])
        let list = this.locations[name].defaults;
        let length = list.length;
        let result = [];
        let prefix = this.locations[name].directory + "/"
        for (let i = 0; i < length; i++) {
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

    static unloadGlobalElements() {
        let names = this.globalElementNames;
        let manifests = this.globalElementManifests;

        let namesLength = names.length;
        let manifest,
            manifestLength

        for (let i = 0; i < namesLength; i++) {
            console.log(manifests)
            manifest = Object.keys(manifests[i])
            console.log(manifest)
            manifestLength = manifest.length;

            window[names[i]] = undefined
            delete window[names[i]]

            for (let j = 0; j < manifestLength; j++) {
                window[manifest[j]] = undefined
                delete window[manifest[j]]
            }
        }
    }

    static hasDependency(name){
        let list = this.globalElementNames
        let length = list.length;
        console.log('looking for ' + name)
        console.log(this.globalElementNames.toString())
        for(let i = 0; i < length; i++){
            if(list[i].toLocaleLowerCase() == name.toLocaleLowerCase())
                return true;
        }

        return false
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
        standardPlayer.sp_Core.loadFile(filePath, () => { this.continue() }, (error, name) => { this.onError(error, name) })
    }
}
