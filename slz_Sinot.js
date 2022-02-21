let sinot = {};

console.log(`
 ____  __  __ _   __  ____      __  ____ 
/ ___)(  )(  ( \\ /  \\(_  _)   _(  )/ ___)
\\___ \\ )( /    /(  O ) )(    / \\) \\\___ \\
(____/(__)\\_)__) \\__/ (__)   \\____/(____/
    `)

function sinot_Test(title, getTestData) {
    console.log(`Found sinot_Test: ${title}`)
    let obj = {
        title: title,
        type: 'test',
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.addTest(obj)
    TestRunner.languages.push(runTest)
}

function resetHooks() {
    resetCaseHooks()
    resetScenarioHooks()
    sinot.beforeAll = () => { }
    sinot.afterAll = () => { }
}

function resetCaseHooks() {
    sinot.beforeEachCase = () => { }
    sinot.afterEachCase = () => { }
    sinot.beforeAll = () => { }
}

function resetScenarioHooks() {
    sinot.beforeEachScenario = () => { }
    sinot.afterEachScenario = () => { }
}


function scenario(title, getScenarioData) {
    return {
        title: title,
        type: 'scenario',
        getScenarioData: () => { return getScenarioData().filter(a => typeof a == 'object') }
    }
}

function testCase(title, testCaseRunner) {
    return {
        title: title,
        type: 'case',
        testCaseRunner: testCaseRunner
    }
}

function beforeAll(f) {
    sinot.beforeAll = f;
}

function afterAll(f) {
    sinot.afterAll = f
}

function beforeEachCase(f) {
    sinot.beforeEachCase = f
}

function afterEachCase(f) {
    sinot.afterEachCase = f
}

function beforeEachScenario(f) {
    sinot.beforeEachScenario = f
}

function afterEachScenario(f) {
    sinot.afterEachScenario = f
}

function runTest(list) { //list is test file using Sinot.js
    let length = list.length;
    //list is array of Scenarios for individual test file
    sinot.reportLevel = "test"
    sinot.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        TestLogger.addData(scenario.type, scenario.title)
        sinot.reportLevel = "scenario"
        sinot.scenarioHeading = scenario.title //<-- Don't think this was even used in POC
        sinot.beforeEachScenario()

        for (let j = 0; j < length2; j++) {
            sinot.reportLevel = "case"
            TestLogger.addData(testCases[j].type, testCases[j].title)

            sinot.beforeEachCase()

            testCases[j].testCaseRunner();
            
            sinot.afterEachCase()
            
        }
        resetCaseHooks()
        sinot.afterEachScenario()
    }
    sinot.afterAll()
    resetHooks()
}

resetHooks()