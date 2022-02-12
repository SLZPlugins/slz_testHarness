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
* @param assertions
* @type struct<Addon>[]
* @text Assertion Engines
* @desc Add any assertion engines you'll use in your tests
* 
* @param plugins
* @type struct<Addon>[]
* @text Harness Plugins
* @desc Add any plugins you want to be available in the harness
*
*/

/*~struct~Addon:
 * 
 * @param filePath
 * @type text
 * @text File Path
 * @desc File location for this Assertion Engine. Must have .js extension.
 * @default js/slz/
 * 
 * @param name
 * @type text
 * @text Name
 * @desc Name of your choosing. This will be used at the beginning of your test files to enable non-default engines.
 * 
 * @param enabled
 * @type boolean
 * @text Enabled
 * @desc Toggle on or off.
 * @default true
 * 
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};


/* ///////////////////////////////////////////////////////////////////////////
        Global Functions #global #scenario #describe
   /////////////////////////////////////////////////////////////////////////// */



function slz_Test(title, engines, plugins, getTestData) {
    let obj = {
        title: title,
        engines: engines,
        plugins: plugins,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.tests.push(obj)
}

function requiresEngine(name) {
    TestFileManager.hasRequiredEngine(name)
}

function requiresPlugin(name) {
    TestFileManager.hasRequiredPlugin(name)
}

function addPreScript(f) {
    TestFileManager.preLoadFunctions.push(f)
}

function addPostScript(f) {
    TestFileManager.postLoadFunctions.push(f)
}



function scenario(title, getScenarioData) {
    return {
        title: title,
        getScenarioData: () => { return getScenarioData().filter(a => typeof a == 'object') }
    }
    // TestRunner.currentTest().scenarios.push(scn)
}

function testCase(title, testCaseRunner) {
    return {
        title: title,
        testCaseRunner: testCaseRunner
    }
}

function beforeAll(f) {
    TestRunner.beforeAll = f;
}

function beforeEachCase(f) {
    TestRunner.beforeEachCase = f
}

function afterEachCase(f) {
    TestRunner.afterEachCase = f
}

function beforeEachScenario(f) {
    TestRunner.beforeEachScenario = f
}

function afterEachScenario(f) {
    TestRunner.afterEachScenario = f
}




/* ///////////////////////////////////////////////////////////////////////////
        Test Runner  #Runner #tr
   /////////////////////////////////////////////////////////////////////////// */

let TestRunner = {
    tests: [],
    testHeading: "",
    scenarioHeading: "",
    caseHeading: ""
}

TestRunner.resetHooks = function () {
    this.resetCaseHooks()
    this.resetScenarioHooks()
    this.beforeAll = () => { }
}

TestRunner.resetCaseHooks = function () {
    this.beforeEachCase = () => { }
    this.afterEachCase = () => { }
    this.beforeAll = () => { }
}

TestRunner.resetScenarioHooks = function () {
    this.beforeEachScenario = () => { }
    this.afterEachScenario = () => { }
}

TestRunner.currentTest = function () {
    let length = this.tests.length;
    return this.tests[length - 1]
}

TestRunner.run = function(){
    slz_TestLoader.runOnComplete = true;
    slz_TestLoader.load();
}

TestRunner.runTest = function (list) {
    let length = list.length;
    //list is array of Scenarios for individual test file
    if (TestFileManager._abortingLoad)
        return

    this.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        this.scenarioHeading = scenario.title
        slz_Reporter.createScenarioReport()
        this.beforeEachScenario()

        if (TestFileManager._abortingLoad)
            return

        for (let j = 0; j < length2; j++) {
            this.caseHeading = testCases[j].title

            this.beforeEachCase()

            testCases[j].testCaseRunner();

            this.afterEachCase()
        }
        this.resetCaseHooks()
        this.afterEachScenario()
    }
}

TestRunner.readAllTests = function () {
    let list = this.tests;
    let length = list.length;
    let engines = [];
    let plugins = [];

    for (let i = 0; i < length; i++) {
        engines = engines.concat(list[i].engines)
        plugins = plugins.concat(list[i].plugins)
    }

    TestFileManager.requiredEn = TestFileManager.requiredPlugins.concat(plugins)
    TestFileManager.requiredPlugins = TestFileManager.requiredPlugins.concat(plugins)
}

TestRunner.runAllTests = function () {
    let list = this.tests;
    let length = list.length;

    if (TestFileManager.missingDependency.length) {
        return TestFileManager.missingDependencyError()
    }

    if (slz_TestLoader.loading)
        return;

    slz_Reporter.resetResults()

    for (let i = 0; i < length; i++) {
        this.resetHooks()
        this.testHeading = list[i].title
        slz_Reporter.createTestReport()
        this.runTest(list[i].loadTestData())
    }

    slz_Reporter.printAllReports()
    TestFileManager.unload()

}


/* ///////////////////////////////////////////////////////////////////////////
        Report Classes #report 
   /////////////////////////////////////////////////////////////////////////// */


class Report {
    heading;
    readout = ""
    constructor(heading) {
        this.heading = heading
    }

    printHeading() {
        this.readout += `${this.heading}\n`
    }
}

class CaseReport extends Report {
    pass;
    expected;
    actual;

    reportCase(pass, expected, actual) {
        this.pass = pass;
        this.expected = expected;
        this.actual = actual;
    }

}

class ScenarioReport extends Report {
    caseReports = [];
    passes = 0;
    fails = 0;
    addReport(heading) {
        let report = new CaseReport(heading);
        this.caseReports.push(report)
        return report
    }

    printCaseReport(report) {
        if (report.pass) {
            this.readout += `PASS: ${report.heading}\n\n`
            this.passes++
        } else {
            this.readout += `FAIL: ${report.heading}\n`
            this.fails++
            this.readout += `    Expected: ${report.expected}\n`
            this.readout += `    Actual: ${report.actual}\n\n`
            this.pass = false;
        }
    }

    printAllCaseReports() {
        this.pass = true;
        this.caseReports.forEach(a => {
            this.printCaseReport(a)
        })
    }

}

class TestReport extends Report {
    scenarioReports = [];
    scenarioPasses = 0;
    scenarioFails = 0;
    casePasses = 0;
    caseFails = 0;

    addReport(heading) {
        let report = new ScenarioReport(heading)

        this.scenarioReports.push(report)
        return report
    }

    printScenarioReport(report) {
        if (report.pass) {
            this.scenarioPasses++
        } else {
            this.scenarioFails++
        }

        report.printAllCaseReports()
        this.casePasses += report.passes
        this.caseFails += report.fails
        return report.readout
    }

    printAllScenarioReports(report) {
        let list = this.scenarioReports;
        let length = list.length;
        let title = ""
        let results = ""
        let readout = "";

        this.pass = true;

        for (let i = 0; i < length; i++) {
            results = this.printScenarioReport(list[i])
            title = `| SCENARIO: ${list[i].heading} --${list[i].pass ? 'PASS' : 'FAIL'}\n`
            readout += "------------------------------------------------\n"
            readout += `${title}`;
            readout += "------------------------------------------------\n"
            readout += results;
            readout += "\n"

            this.pass = list[i].pass ? this.pass : false;
        }
        this.readout += `Scenarios Passed: ${this.scenarioPasses}    Scenarios Failed: ${this.scenarioFails}\n\n`
        this.readout += readout;

        return this.readout
    }
}

/* ///////////////////////////////////////////////////////////////////////////
        slz_Reporter Class #reporter #_report
   /////////////////////////////////////////////////////////////////////////// */

class slz_Reporter {
    static scenarioPasses = 0;
    static scenarioFails = 0;
    static casePasses = 0;
    static caseFails = 0;
    static testReports = [];
    constructor() {
        throw new Error('This is a static class')
    }


    static createTestReport() {
        let report = new TestReport(TestRunner.testHeading)

        this.testReports.push(report)
        return report
    }

    static createScenarioReport() {
        let currentTestReport = this.getCurrentTestReport();
        let scenarioReport = currentTestReport.addReport(TestRunner.scenarioHeading)

        return scenarioReport;
    }

    static createCaseReport() {
        let currentScenarioReport = this.getCurrentScenarioReport()
        let caseReport = currentScenarioReport.addReport(TestRunner.caseHeading)

        return caseReport
    }

    static getCurrentTestReport() {
        return this.testReports[this.testReports.length - 1]
    }

    static getCurrentScenarioReport() {
        let currentTestReport = this.getCurrentTestReport();

        return currentTestReport.scenarioReports[currentTestReport.scenarioReports.length - 1]
    }

    static getCurrentCaseReport() {
        let currentScenarioReport = this.getCurrentScenarioReport();

        return currentScenarioReport.testReports[currentScenarioReport.testReports.length - 1]
    }

    static printAllReports() {
        let list = this.testReports;
        let length = list.length;
        let summary;
        let header = "\n\n==================Test Results ==================\n"
        let readout = ""
        for (let i = 0; i < length; i++) {
            readout += list[i].heading + "\n\n";
            readout += list[i].printAllScenarioReports()
            this.scenarioPasses += list[i].scenarioPasses
            this.scenarioFails += list[i].scenarioFails
            this.casePasses += list[i].casePasses
            this.caseFails += list[i].caseFails
        }

        readout = header + this.summary() + readout
        readout += "================================================="
        console.log(readout)
    }

    static getTestPasses() {
        let list = this.testReports;
        let length = list.length;
        let pass = 0;
        let fail = 0;
        for (let i = 0; i < length; i++) {
            if (list[i].pass) {
                pass++
            } else {
                fail++
            }
        }

        return [pass, fail]
    }

    static summary() {
        let str = "--Summary--\n";
        let sPass = this.scenarioPasses;
        let sFails = this.scenarioFails;
        let sTotal = sPass + sFails
        let sPercentage = sPass / sTotal;
        let cPass = this.casePasses;
        let cFails = this.caseFails;
        let cTotal = cPass + cFails;
        let cPercentage = cPass / cTotal;
        let tPassFail = this.getTestPasses()
        let tTotal = tPassFail[0] + tPassFail[1]
        let tPercentage = tPassFail[0] / tTotal;

        str += `Tests:     ${tPercentage.toFixed(2).substr(2)}% (${tPassFail[0]}/${tPassFail[1]})\n`
        str += `Scenarios: ${sPercentage.toFixed(2).substr(2)}% (${sPass}/${sFails})\n`
        str += `Cases:     ${cPercentage.toFixed(2).substr(2)}% (${cPass}/${cFails})\n\n\n`

        return str
    }

    static resetResults() {
        this.scenarioFails = 0;
        this.scenarioPasses = 0;
        this.caseFails = 0;
        this.casePasses = 0;
    }
}



/* ///////////////////////////////////////////////////////////////////////////
        TestFileManager Class #FileManager #fm
   /////////////////////////////////////////////////////////////////////////// */

class TestFileManager {
    static locations = standardPlayer.sp_Core.fullUnpack(PluginManager.parameters('slz_testHarness'));
    static missingDependency = [];
    constructor() {
        throw new Error('This is a static class')
    }


    static missingDependencyError() {
        let str = "";
        console.log('Cannot run tests, missing the following dependencies: ')

        this.missingDependency.forEach(a => str += `${a}\n`)

        console.log(str)
        console.log('Please include these files in the slz_testHarness plugin params in RPG Maker')
    }


    static hasAllTestEngines() {
        let list = TestRunner.tests;
        let length = list.length;
        let test,
            engines

        for (let i = 0; i < length; i++) {
            test = list[i]
            engines = test.engines;
            for (let j = 0; j < engines.length; j++) {
                this.hasRequiredDependency(engines[i])
            }
        }
    }

    static hasAllTestPlugins() {
        let list = TestRunner.tests;
        let length = list.length;
        let test,
            plugins

        for (let i = 0; i < length; i++) {
            test = list[i]
            plugins = test.plugins;
            for (let j = 0; j < plugins.length; j++) {
                this.hasRequiredDependency(plugins[i])
            }
        }
    }

    static hasAllTestDependencies() {
        this.missingDependency = [];
        this.hasAllTestEngines()
        this.hasAllTestPlugins()

        return this.missingDependency.length == 0;
    }

    static hasRequiredEngine(name) {
        return this.hasRequiredDependency(name, this.locations.plugins)
    }

    static hasRequiredPlugin(name) {
        return this.hasRequiredDependency(name, this.locations.plugins)
    }

    static hasRequiredDependency(name, location) {
        let list = location;
        let length = list.length

        name = name.toLocaleLowerCase()

        for (let i = 0; i < length; i++) {
            if (list[i].name.toLocaleLowerCase() === name && list[i].enabled)
                return true
        }

        if (!this.missingDependency.contains(name)) {
            this.missingDependency.push(name)
        }
        return false

    }

    static onErrorCb(error) {
        console.log('error loading file')
        console.log(error)
    }


    static findFilesInDir(includeDir, currentPath) {
        let fs = require('fs');
        let currentFile;
        let stats;
        let files;
        let result = [];
        let i = 0;

        files = fs.readdirSync(currentPath);
        for (i in files) {
            currentFile = currentPath + '/' + files[i];
            stats = fs.statSync(currentFile);
            if (stats.isFile()) {
                result.push(currentFile);
            }
            else if (stats.isDirectory() && includeDir) {
                result = result.concat(TestFileManager.findFilesInDir(true, currentFile));
            }


        }
        return result
    }


    static unload() {
        let locations = this.locations;
        let list = locations.plugins.concat(locations.assertions)
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if(!list[i].enabled)
                continue

            console.log(list[i])
            window[list[i].name] = undefined
            delete window[list[i].name]
        }
    }

}

/* ///////////////////////////////////////////////////////////////////////////
        slz_TestLoader Class #loader 
   /////////////////////////////////////////////////////////////////////////// */


class slz_TestLoader {
    static index = 0;
    static preLoaded = false;
    static manifest = [];
    static loading = false;
    static runOnComplete = false;

    constructor() {
        throw new Error("This is a static class");
    }


    static createManifest(location) {
        //Here, I need to examine TestFileManager, and the loaded tests, 
        //to determine if the plugins and engines mentioned in the tests
        //are currently in the project, enabled or disabled
        //If everything passes, move on to loading plugins and asertions
        let fm = this.fm();
        let proceed = fm.hasAllTestDependencies()

        if (proceed) {

        }


    }

    static createFullManifest() {
        let fm = this.fm();
        let engines = fm.locations.assertions;
        let plugins = fm.locations.plugins;
        let list = engines.concat(plugins)
        let length = list.length;
        let manifest = [];


        for (let i = 0; i < length; i++) {
            if(!list[i].enabled)
                continue 

            manifest.push(
                () => {
                    this.loadFile(list[i].filePath, this.continue)
                }
            )
        }

        return manifest
    }

    static createTestManifest() {
        let fm = this.fm()
        let list = fm.findFilesInDir(true, fm.locations.testDirectory)
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

    static createEngineManifest() {
        return this.createManifest(this.fm().locations.assertions)
    }

    static createPluginManifest() {
        return this.createManifest(this.fm().locations.plugins)
    }

    static preLoad() {
        this.manifest = this.createTestManifest()

        if (!this.manifest.length)
            return

        this.loading = true;
        this.manifest.shift()()
    }

    static load() {
        if (!this.preLoaded) {
            return this.preLoad()
        }

        this.loading = true;
        this.manifest = this.createFullManifest()

        if (this.manifest.length)
            this.manifest.shift()()

    }

    static continue() {

        if (this.manifest.length) { //if there is more to run
            this.manifest.shift()()
        } else if (!this.preLoaded) { //if you are finished preloading
            this.preLoaded = true;
            this.load()
        } else { //if you are finished loading altogether
            this.loading = false;
            this.preLoaded = false;
            this.onComplete()
        }
    }

    static onComplete(){
        if(!this.runOnComplete)
            return

        this.runOnComplete = false;
        TestRunner.runAllTests();
    }

    static fm() {
        return TestFileManager
    }


    static loadFile(filePath, success) {

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 0) {
                    try {
                        eval(xhr.responseText);
                    } catch (e) {
                        TestFileManager.onErrorCb(e);
                        return;
                    }
                    success.call(this);
                } else {
                    TestFileManager.onErrorCb(xhr.status);
                }
            }
        }.bind(this);

        try {
            xhr.open("GET", filePath, true);
            xhr.send();
        } catch (e) {
            TestFileManager.onErrorCb(e);
        }
    }
}