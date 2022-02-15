let model = {
    name:"sinot",
    beforeAll:()=>{},
    beforeEachCase:()=>{},
    beforeEachScenario:()=>{},
    afterEachCase:()=>{},
    afterEachScenario:()=>{},
}

function sinot_Test(title, getTestData) {
    console.log('calling sinot_Test')
    let obj = {
        title: title,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.tests.push(obj)
}

function resetHooks() {
    resetCaseHooks()
    resetScenarioHooks()
    sinot.model.beforeAll = () => { }
}

function resetCaseHooks() {
    sinot.model.beforeEachCase = () => { }
    sinot.model.afterEachCase = () => { }
    sinot.model.beforeAll = () => { }
}

function resetScenarioHooks() {
    sinot.model.beforeEachScenario = () => { }
    sinot.model.afterEachScenario = () => { }
}


function scenario(title, getScenarioData) {
    return {
        title: title,
        getScenarioData: () => { return getScenarioData().filter(a => typeof a == 'object') }
    }
}

function testCase(title, testCaseRunner) {
    return {
        title: title,
        testCaseRunner: testCaseRunner
    }
}

function beforeAll(f) {
    sinot.model.beforeAll = f;
}

function beforeEachCase(f) {
    sinot.model.beforeEachCase = f
}

function afterEachCase(f) {
    sinot.model.afterEachCase = f
}

function beforeEachScenario(f) {
    sinot.model.beforeEachScenario = f
}

function afterEachScenario(f) {
    sinot.model.afterEachScenario = f
}

function runTest(list) { //list is test file using Sinot.js
    let length = list.length;
    let reporter = HarnessReporter;
    //list is array of Scenarios for individual test file
    sinot.model.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;
        console.log(scenario.title)
        reporter.createReport(scenario.title)
        sinot.model.scenarioHeading = scenario.title //<-- Don't think this was even used in POC
        sinot.model.beforeEachScenario()

        for (let j = 0; j < length2; j++) {
            TestRunner.testHeading = testCases[j].title

            sinot.model.beforeEachCase()

            testCases[j].testCaseRunner();
            
            sinot.model.afterEachCase()
            
        }
        resetCaseHooks()
        sinot.model.afterEachScenario()
    }
}


console.log(
`===========================================================\n
=                   WELCOME TO SINOT JS                   =\n
===========================================================`
)


let manifest = {
    sinot_Test: sinot_Test,
    scenario: scenario,
    testCase: testCase,
    beforeAll: beforeAll,
    beforeEachCase: beforeEachCase,
    beforeEachScenario: beforeEachScenario,
    afterEachCase: afterEachCase,
    afterEachScenario: afterEachScenario,
    resetHooks: resetHooks,
    resetCaseHooks: resetCaseHooks,
    resetScenarioHooks: resetScenarioHooks,
    runTest: runTest,
}

registerLanguage(model, manifest)