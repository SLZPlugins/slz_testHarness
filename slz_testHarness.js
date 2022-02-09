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
 * @param default
 * @type boolean
 * @text Always Load
 * @desc If true, this engine will be available by default in all of your tests. See help for more details.
 * @default true
 * 
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};

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

TestRunner.runTest = function (list) {
    let length = list.length;
    //list is array of Scenarios for individual test file
    this.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        this.scenarioHeading = scenario.title
        slz_Reporter.createScenarioReport()
        this.beforeEachScenario()

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

TestRunner.runAllTests = function () {
    let list = this.tests;
    let length = list.length;

    for (let i = 0; i < length; i++) {
        this.resetHooks()
        this.testHeading = list[i].title
        slz_Reporter.createTestReport()
        this.runTest(list[i].loadTestData())
    }
}







function slz_Test(title, getTestData) {
    let obj = {
        title: title,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.tests.push(obj)
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


class Reporter {
    pass;
    expected;
    actual;
    constructor(heading) {
        this.heading = heading;
    }

    report(pass, expected, actual) {
        this.pass = pass;
        this.expected = expected;
        this.actual = actual;
    }

    print() {
        let status = this.pass ? "PASSED" : "FAILED"
        return ``
    }
}


class Report {
    heading;
    constructor(heading) {
        this.heading = heading
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

    addReport(heading) {
        let report = new CaseReport(heading);
        this.caseReports.push(report)
        return report
    }

}

class TestReport extends Report {
    scenarioReports = [];

    addReport(heading) {
        let report = new ScenarioReport(heading)

        this.scenarioReports.push(report)
        return report
    }
}

class slz_Reporter {
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
}



class TestFileManager {
    static locations = standardPlayer.sp_Core.fullUnpack(PluginManager.parameters('slz_testHarness'));
    static tests = [];
    static _testsLoaded = [];
    static plugins = [];
    static _pluginsLoaded = [];
    static assertions = [];
    static _assertionsLoaded = [];


    constructor() {
        throw new Error('This is a static class')
    }

    static onLoadCb(index, pointerName) {
        return () => {
            let fm = TestFileManager
            fm[`_${pointerName}Loaded`][index] = true;
            fm[`${pointerName}Loaded`]()
        }
    }

    static onErrorCb(error) {

    }

    static loadAssertionEngines() {
        let assertionsLoaded = [];
        let assertions = [];
        let list = this.locations.assertions;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            assertionsLoaded.push(false)
            assertions.push(list[i].name)
            this.loadFile(list[i].filePath, this.onLoadCb(i, 'assertions'), this.onErrorCb)
        }

        this._assertionsLoaded = assertionsLoaded
        this.assertions = assertions

    }

    static loadPlugins(){
        let pluginsLoaded = [];
        let plugins = [];
        let list = this.locations.plugins;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            pluginsLoaded.push(false)
            plugins.push(list[i].name)
            this.loadFile(list[i].filePath, this.onLoadCb(i, 'plugins'), this.onErrorCb)
        }

        this._pluginsLoaded = pluginsLoaded
        this.plugins = plugins
    }

    static loadTests(){
        let testsLoaded = [];
        let tests = [];
        let list = this.findFilesInDir(true, this.locations.testDirectory)
        let length = list.length;

        for (let i = 0; i < length; i++) {
            testsLoaded.push(false)
            tests.push(list[i].name)
            this.loadFile(list[i], this.onLoadCb(i, 'tests'), this.onErrorCb)
        }

        this._testsLoaded = testsLoaded
        this.tests = tests
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

    static assertionsLoaded() {
        let list = this._assertionsLoaded;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if (!list[i])
                return false;
        }

        return true;
    }

    static pluginsLoaded() {
        let list = this._pluginsLoaded;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if (!list[i])
                return false;
        }

        return true;
    }

    static testsLoaded() {
        let list = this._testsLoaded;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            if (!list[i])
                return false;
        }

        return true;
    }

    static loadFile(filePath, success) {
        console.log(filePath)
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
                    success();
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