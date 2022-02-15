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
    HarnessFileManager.addDependency(dependency)
}

function requireLanguage(dependency) {
    //Language specific operations/assignment
try{
    requiredLanguage = HarnessFileManager.hasDependency(dependency)
    if(requiredLanguage){
        TestRunner.setTestLanguage(HarnessFileManager.getModel(dependency))
        requireDependency(dependency)
    } else {
        throw new slz_DependencyError(dependency)
    }
} catch(error){
    console.log(error)

}

    


}

function requireEngine(module, ...names) {
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

    if (HarnessFileManager.globalElementNames.contains(model.name))
        return

    window[model.name] = { model: model }
    model.install()

    for (let i = 0; i < length; i++) {
        window[list[i]] = manifest[list[i]]
    }

    HarnessFileManager.addGlobalElement(model.name, manifest)
}

function registerLanguage(model, manifest) {
    //Language specific operations/assignment

    if (!LanguageValidator.validate(model, manifest))
        return

    this.registerDependency(model, manifest)
}

function registerEngine(model, manifest) {
    //Engine specific operations/assignment
    if (!EngineValidator.validate(model, manifest))
        return

    this.registerDependency(model, manifest)

}

function registerComponent(model, manifest) {
    //Component specific operations/assignment
    if (!ComponentValidator.validate(model, manifest))
        return

    this.registerDependency(model, manifest)
}

function registerReporter(model, manifest, reporter) {

    if (!ReporterValidator.validate(model, manifest, reporter))
        return

    this.registerDependency(model, manifest)
    HarnessReporter.install(reporter)
}

function slzRegistrationError(data) {
    console.log(`Error registering Module: ${data.name}`)
    console.log(data)
}

class slz_ValidationDefinitionError extends Error {
    message
    moduleName
    definition

    constructor(moduleName, definition) {
        super('slz_ValidationDefinitionError')
        this.moduleName = moduleName
        this.definition = definition
    }

    valueOf() {
        return `ERROR while validating ${this.type}: ${this.moduleName}
        Missing defintion: ${this.definition}`
    }
}

class slz_TestModuleDefinitionError extends slz_ValidationDefinitionError {
    type = "Test"

    constructor(moduleName, definition) {
        super(moduleName, definition)
    }
}

class slz_LanguageModuleDefinitionError extends slz_ValidationDefinitionError {
    type = "Language"

    constructor(moduleName, definition) {
        super(moduleName, definition)
    }

}

class slz_EngineModuleDefinitionError extends slz_ValidationDefinitionError {
    type = "Engine"

    constructor(moduleName, definition) {
        super(moduleName, definition)
    }
}

class slz_ComponentModuleDefinitionError extends slz_ValidationDefinitionError {
    type = "Component"

    constructor(moduleName, definition, type) {
        super(moduleName, definition)
        this.type = typeof type != undefined ? type : this.type // <-- Haha
    }
}


class slz_DependencyError extends Error {
    dependency;

    constructor(dependency) {
        super(dependency)
        this.dependency = dependency
    }

    valueOf() {
        return `ERROR Missing Dependency: ${this.dependency}`
    }
}



/* ///////////////////////////////////////////////////////////////////////////
        Test Runner  #runner #tr
   /////////////////////////////////////////////////////////////////////////// */

class TestRunner {
    static tests = []
    static languages = []
    static logs = []

    constructor() {
        throw new Error('This is a static class')
    }

    static addTest(test) {
        this.tests.push(test)
    }

    static setTestLanguage(model) {
        if (!model) {
            this.stopTests = true;
            throw new slz_DependencyError('Error: Unable to load Test langauge')
        }

        this.languages.push(model.runTest)

    }


    static run() {
        this.initialize()
        if(!HarnessFileManager.hasAllDependencies())
            return

        HarnessLoader.runOnComplete = true;
        HarnessLoader.load()
    }

    static runTest(index, test) {
        HarnessReporter.createReport()
        HarnessReporter.setHeading(test.title)
        this.languages[index](test.loadTestData())
    }

    static runAllTests() {
        let list = this.tests;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if (this.stopTests) {
                console.log('TestRunner stopping execution')
                return this.running = false
            }

            this.runTest(i, list[i])
        }

        this.onComplete()
    }

    static initialize() {
        this.tests = [];
        this.logs = [];
        this.languages = [];
        this.stopTests = false;
    }

    static onComplete() {
        this.running = false;
        HarnessReporter.print()
        HarnessFileManager.unload()
    }

    static logger(...messages) {
        //Implement actual logger on HarnessReporter. Calling createReport could cause issues
        //with external Reporters, as it will also call them.
    }

}

/* ///////////////////////////////////////////////////////////////////////////
        HarnessValidator  #hv #validate
   /////////////////////////////////////////////////////////////////////////// */

class HarnessValidator {
    static model
    static manifest
    static missingMethods = []
    static validCore = true;
    static valid = true;

    constructor() {
        throw new Error('This is a static class')
    }

    static validate(model, manifest) {
        this.model = model;
        this.manifest = manifest;
        this.validCore = true;
        try {
            this.validateCoreObjects()
            this.validateInstallMethod()
        } catch (error) {
            console.log(error.valueOf())
            this.validCore = false;
        }
    }

    static validateCoreObjects() {
        if (typeof this.model !== 'object') {
            throw new slz_ComponentModuleDefinitionError('<No model/Module Name Provided>', 'model', 'Reporting Component')
        }

        if (typeof this.model.name !== 'string') {
            throw new slz_ComponentModuleDefinitionError('<No Module Name Provided>', 'model.name', 'Reporting Component')
        }

        if (typeof this.manifest !== 'object') {
            throw new slz_ComponentModuleDefinitionError(model.name, 'manifest', 'Reporting Component')
        }
    }

    static validateInstallMethod() {
        if (typeof this.model.install !== 'function') {
            throw new slz_ComponentModuleDefinitionError(model.name, 'model.install', 'Reporting Component')
        }
    }
}

class ReporterValidator extends HarnessValidator {
    constructor() {
        throw new Error('This is a static class')
    }

    static validate(model, manifest, reporter) {
        this.valid = true
        try {
            super.validate(model, manifest)
            this.reporter = reporter
            this.validateReporter()

        } catch (error) {
            console.log(error.valueOf())
            this.valid = false;
        }

        this.model = undefined;
        this.manifest = undefined;

        return this.valid && this.validCore
    }

    static validateReporter() {
        try {
            this.validateIsClass()
            this.validateExtendsHarnessReporter()
            this.validateIsStaticClass()
            this.validateCreateReport()
            this.validatePrint()
        } catch (error) {
            console.log(error.valueOf())

            this.valid = false;
        }
    }

    static validateIsClass() {
        if (typeof this.reporter.prototype !== 'object') {
            console.log('Reporter should be a class or constructor function')
            throw new slz_ComponentModuleDefinitionError(this.model.name, 'reporter.prototype', 'Reporting Component')
        }
    }

    static validateExtendsHarnessReporter() {
        if (this.reporter.prototype instanceof HarnessReporter !== true) {
            console.log('Custom Reporter classes should extend HarnessReporter')
            throw new slz_ComponentModuleDefinitionError(this.model.name, 'reporter', 'Reporting Component')
        }
    }

    static validateIsStaticClass() {
        let isStatic = false
        try {
            new this.reporter.prototype.constructor()
        } catch (error) {
            isStatic = true
        }

        if (!isStatic) {
            console.log('Custom Reporter classes should not be instantiable')
            throw new slz_ComponentModuleDefinitionError(this.model.name, 'reporter instantiable constructor', 'Reporting Component')
        }
    }

    static validateCreateReport() {
        if (typeof this.reporter.createReport !== 'function') {
            console.log('Custom Reporter classes should have a static createReport method')
            throw new slz_ComponentModuleDefinitionError(this.model.name, 'static reporter.createReport', 'Reporting Component')
        }
    }

    static validatePrint() {
        if (typeof this.reporter.print !== 'function') {
            console.log('Custom Reporter classes should have a static print method')
            throw new slz_ComponentModuleDefinitionError(this.model.name, 'static reporter.print', 'Reporting Component')
        }
    }
}


class EngineValidator extends HarnessValidator{
    constructor() {
        throw new Error('This is a static class')
    }

    static validate(model, manifest) {
        super.validate(model, manifest)
        try {
            this.validateEngine()
        } catch (error) {
            console.log(error)
            this.valid = false;
        }

        return this.validCore && this.valid
    }

    static validateEngine() {

    }
}

class LanguageValidator extends HarnessValidator{
    constructor() {
        throw new Error('This is a static class')
    }

    static validate(model, manifest) {
        super.validate(model, manifest)
        try {
            this.validateLanguage()
        } catch (error) {
            console.log(error)
            this.valid = false;
        }

        return this.validCore && this.valid
    }

    static validateLanguage() {
        this.validateRunTesMethod()
    }

    static validateRunTesMethod() {
        if (typeof this.manifest.runTest !== 'function') {
            console.log('Languages must implement a runTest method, to define how their tests should be run')
            throw new slz_LanguageModuleDefinitionError(this.model.name, 'manifest.runTest')
        }
    }
}

class ComponentValidator extends HarnessValidator{
    constructor() {
        throw new Error('This is a static class')
    }

    static validate(model, manifest) {
        super.validate(model, manifest)
        try {
            this.validateComponent()
        } catch (error) {
            console.log(error)
            this.valid = false;
        }

        return this.validCore && this.valid
    }

    static validateComponent() {
        
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
        throw new Error('This is a static class')
    }



    static install(reporter) {
        this.reporterList.push(reporter)
    }



    static createReport(heading, ...args) {
        let list = this.reporterList
        let length = list.length;
        let called = false;
        let reports = [];

        for (let i = 0; i < length; i++) {
            if (typeof list[i]['createReport'] === 'function') {
                reports.push[list[i].createReport(heading, args)]
                called = true;
            }
        }

        if (!called) {
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

    static currentReports() {
        let list = this.reporterList;
        let length = list.length;
        let reports = [];

        for (let i = 0; i < length; i++) {
            reports.push(list[i].currentReport())
        }

        return reports
    }

    static setHeading(heading) {
        let reports = this.currentReports()

        reports.forEach(a => a.setHeading(heading))
    }

    static print() {
        console.log('calling static print')
        let list = this.reporterList;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            list[i].print()
        }
    }
}




/* ///////////////////////////////////////////////////////////////////////////
        HarnessReport #rep #hr #report
   /////////////////////////////////////////////////////////////////////////// */

class HarnessReport {
    data;
    reports = [];
    heading = ""

    constructor(heading, data) {
        this.heading = heading;
        this.data = data
    }

    addReport(heading, data) {
        let report = new HarnessReport(heading, data)
        this.reports.push(report)

        return report
    }

    report(data) {
        this.data = data;
    }

    setHeading(heading) {
        this.heading = heading
    }


    currentReport() {
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
    static dependencies = [];

    constructor() {
        throw new Error('This is a static class. Stop trying to instantiate everything')
    }


    static getModel(dependencyName) {
        let list = this.globalElementNames
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if (list[i].toLocaleLowerCase() === dependencyName.toLocaleLowerCase()) {
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

    static addDependency(dependency){
        let list = this.dependencies;

        if(!list.contains(dependency))
            list.push(dependency)

        
    }


    static readAllFileNames() {
        this.getTestFileNames()
        this.getLanguageFileNames()
        this.getEngineFileNames()
        this.getComponentFileNames()
    }

    static unload() {
        this.unloadGlobalElements()
    }

    static unloadGlobalElements() {
        let names = this.globalElementNames;
        let manifests = this.globalElementManifests;
        let namesLength = names.length;
        let manifest,
            manifestLength

        console.log(names)
        for (let i = 0; i < namesLength; i++) {
            manifest = Object.keys(manifests[i])
            manifestLength = manifest.length;

            window[names[i]] = undefined
            delete window[names[i]]

            for (let j = 0; j < manifestLength; j++) {
                window[manifest[j]] = undefined
                delete window[manifest[j]]
            }

            this.globalElementNames = [];
            this.globalElementManifests = [];
        }
    }

    static hasDependency(name) {
        let list = this.globalElementNames
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if (list[i].toLocaleLowerCase() == name.toLocaleLowerCase())
                return true;
        }
        console.log('pushing missing dependency')
        this.missingDependency.push(name)
        return false
    }

    static hasAllDependencies(){
        let list = this.dependencies;
        let length = list.length;
        let loadedDependencies = this.globalElementNames;
        let missingDependencies = [];

        for(let i = 0; i < length; i++){
            if(!loadedDependencies.contains(list[i]))
                missingDependencies.push(list[i])        
        }

        this.missingDependency = missingDependencies;

        if(missingDependencies.length){
            throw new slz_DependencyError(missingDependencies.toString())    
        }

        return missingDependencies.length === 0;
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

        HarnessFileManager.missingDependency = [];

        if (this.manifest.length)
            this.manifest.shift()()

    }

    static continue() {
        if (this.manifest.length) { //if there is more to run
            this.manifest.shift()()
        } else { //if you are finished loading altogether
            this.loading = false;
            try{
                this.onComplete()
            }
            catch(error){
                console.log(error)
            }
        }
    }

    static onComplete() {
        // this.fm().checkAllDependencies()

        if (!this.runOnComplete)
            return

        if (HarnessFileManager.missingDependency.length > 0) {
            throw new slz_DependencyError(`Missing Dependencies. Please check logs above for missing dependency module name,
            or enter HarnessFileManager.missingDependency to access the missing dependency names array`)
        }

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
        standardPlayer.sp_Core.loadFile(filePath, () => { this.continue() }, (error, name) => { this.onError(error, name) })
    }
}
