let TestRunner = {
    tests: [],
    loaded: require('js/plugins/someOther.js')
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
        console.log(`Scenario: ${scenario.title}`)
        this.beforeEachScenario()
        for (let j = 0; j < length2; j++) {
            console.log(`Test Case: ${testCases[j].title}`)
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
        console.log(`RUNNING TEST: ${list[i].title}`)
        this.runTest(list[i].loadTestData())
    }
}

TestRunner.loadTestFile = async function loadJS(url, onDone, onError) {
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


