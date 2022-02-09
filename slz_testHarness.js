let TestRunner = {
    tests: [],
    testHeading: "",
    scenarioHeading: "",
    caseHeading: ""
}

TestRunner.bar = function () {
    console.log('===============================')
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



TestRunner.loadTestFile = function (url, onDone, onError) {
    if (!onDone) onDone = function () { };
    if (!onError) onError = function () { };
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200 || xhr.status == 0) {
                try {
                    eval(xhr.responseText);
                } catch (e) {
                    onError(e);
                    return;
                }
                onDone();
            } else {
                onError(xhr.status);
            }
        }
    }.bind(this);
    try {
        xhr.open("GET", url, true);
        xhr.send();
    } catch (e) {
        onError(e);
    }
}

TestRunner.loadAssertionLibrary = function () {
    this.loadTestFile('js/plugins/slz_Assertions.js')
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
