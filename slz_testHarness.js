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


function requireDependency(names){
    
}

function requireLanaguage(...names){
    //Language specific operations/assignment
    names.forEach(dependency => 
        this.requireDependency(dependency)    
        )
    
}

function requireEngine(...names){
    //Engine specific operations/assignment
    names.forEach(dependency => 
        this.requireDependency(dependency)    
        )
    
}

function requireComponent(...names){
    //Component specific operations/assignment
    names.forEach(dependency => 
        this.requireDependency(dependency)    
        )
    
}


function registerDependency(name, data){

}

function registerLanguage(name, data){
    //Language specific operations/assignment
    this.registerDependency(name, data)
}

function registerEngine(name, data){
    //Engine specific operations/assignment
    this.registerDependency(name, data)
}

function registerComponent(name, data){
    //Component specific operations/assignment
    this.registerDependency(name, data)
}

function registerReporter(name, data){
    //Reporter specific operations/assignment
    this.registerDependency(name, data)
}

function slzRegistrationError(data){
    console.log(`Error registering Module: ${data.name}`)
    console.log(data)
}

function slzDependencyError(data){
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
