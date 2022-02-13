/*:
* @plugindesc SLZ standardplayer-Lanzy JS Test Harness for MV and MZ
* @author slz
* @target MZ
*
* @param testDirectory
* @type text
* @text Main Test Directory
* @default js/slz/test
* 
* @param languages
* @type struct<Module>[]
* @text Languages
* @desc Configure paths for Language Modules
* 
* @param engines
* @type struct<Module>[]
* @text Engines
* @desc Configure paths for Engine Modules
*
* @param components
* @type struct<Module>[]
* @text Components
* @desc Configure paths for Component Modules
*
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
 * 
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};

/* ///////////////////////////////////////////////////////////////////////////
        Global Functions #global #scenario #describe
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


function registerDependency(name, data) {

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

function slzDependencyError(data) {
    console.log(`Missing Dependency Module: ${data.name}`)
    console.log(data)
}




/* ///////////////////////////////////////////////////////////////////////////
        Test Runner  #Runner #tr
   /////////////////////////////////////////////////////////////////////////// */

class TestRunner {
    static tests = []
    static language

    constructor() {
        throw new Error('This is a static class')
    }

    static addTest(test) {

    }

    static #setTestLanguage() {

    }

    static initialize() {
        this.#setTestLanguage()
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
        HarnessFileManager  #fm #file #manager
   /////////////////////////////////////////////////////////////////////////// */

class HarnessFileManager {
    static locations = standardPlayer.sp_Core.fullUnpack(PluginManager.parameters('slz_testHarness'));
    static missingDependency = [];
    static defaultTestFiles = []
    static languageFiles = []
    static engineFiles = []
    static componentFiles = []
    static reporterFiles = []

    constructor() {
        throw new Error('This is a static class. Stop trying to instantiate everything')
    }


    static #getTestFileNames() {
        this.defaultTestFiles = this.#getFileNames(this.locations.testDirectory)
    }

    static #getLanguageFileNames() {
        this.languageFiles = this.#getFileNames(this.locations.languages)
    }

    static #getEngineFileNames() {
        this.engineFiles = this.#getFileNames(this.locations.engines)
    }

    static #getComponentFileNames() {
        this.componentFiles = this.#getFileNames(this.locations.components)
    }

    static #getFileNames(directory) {
        if (!directory)
            return []

        return standardPlayer.sp_Core.findFilesInDir(true, directory)
    }

    static readAllFileNames() {
        this.#getTestFileNames()
        this.#getLanguageFileNames()
        this.#getEngineFileNames()
        this.#getComponentFileNames()
    }

}

/* ///////////////////////////////////////////////////////////////////////////
        HarnessLoader  #hl #loader
   /////////////////////////////////////////////////////////////////////////// */

class HarnessLoader {
    static #preLoaded = false;
    static #manifest = [];
    static loading = false;
    static runOnComplete = false;

    constructor() {
        throw new Error('This is a static class')
    }

    static #createFullManifest() {
        let fm = this.#fm();
        let engines = fm.engineFiles;
        let components = fm.componentFiles;
        let languages = fm.languageFiles;
        let list = languages.concat(engines.concat(components))
        let length = list.length;
        let manifest = [];


        for (let i = 0; i < length; i++) {
            if (!list[i].enabled)
                continue

            manifest.push(
                () => {
                    this.loadFile(list[i].filePath, this.continue)
                }
            )
        }

        return manifest
    }

    static #createTestManifest() {
        let fm = this.#fm()
        let list = fm.defaultTestFiles
        let loadFunctions = []
        let length = list.length;

        for (let i = 0; i < length; i++) {
            loadFunctions.push(
                () => {
                    this.loadFile(list[i], this.continue)
                }
            )
        }

        return loadFunctions
    }


    static #preLoad() {
        this.#manifest = this.#createTestManifest()

        if (!this.#manifest.length)
            return

        this.loading = true;
        this.#manifest.shift()()
    }

    static load() {
        if (!this.#preLoaded) {
            return this.#preLoad()
        }

        this.loading = true;
        this.#manifest = this.#createFullManifest()

        if (this.#manifest.length)
            this.#manifest.shift()()

    }

    static #continue() {

        if (this.#manifest.length) { //if there is more to run
            this.#manifest.shift()()
        } else if (!this.#preLoaded) { //if you are finished preloading
            this.#preLoaded = true;
            this.load()
        } else { //if you are finished loading altogether
            this.loading = false;
            this.#preLoaded = false;
            this.#onComplete()
        }
    }

    static #onComplete() {
        // this.fm().checkAllDependencies()

        if (!this.runOnComplete)
            return

        this.runOnComplete = false;
        TestRunner.runAllTests();
    }

    static onError(error){
        console.log('Error loading file')
        console.log(error)
    }

    static #fm() {
        return HarnessFileManager
    }


    static loadFile(filePath, success) {
        standardPlayer.sp_Core.loadFile(filePath, success, this.onError)
    }
}
