let TestRunner = {
    tests: []
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


slz_Test("Test A", () => {
    //can scope varibles to entire test instace
    let testLevelVar = 'Running Before All'
    return [
        beforeAll(() => {
            console.log(testLevelVar)
        }),
        beforeEachScenario(() => {
            console.log('Staring Scenario')
        }),

        afterEachScenario(() => {
            console.log('Ending Scenario')
        }),
        scenario("Testing Add to Storage", () => {
            //can scope varibles to individual scenario
            let scenarioLevelVar = 'first before each case'
            return [
                beforeEachCase(() => {
                    TestRunner.bar()
                    console.log(scenarioLevelVar)
                }),
                afterEachCase(() => {
                    console.log('scenario 1 after each case')
                    TestRunner.bar()
                }),
                testCase("Should add successfully when space available", () => {
                    console.log('test 1-1')
                }),
                testCase("Should update Individual Entry", () => {
                    console.log('test 1-2')
                }),
                testCase("Should update Individual Entry", () => {
                    console.log('test 1-3')
                })
            ]
        }),


        scenario("Testing Subtract from Storage", () => {
            return [
                beforeEachCase(() => {
                    TestRunner.bar()
                    console.log('scenario 2 before each case')
                }),
                afterEachCase(() => {
                    console.log('scenario 2 after each case')
                    TestRunner.bar()
                }),
                testCase("Should remove successfully when contents exist", () => {
                    console.log('test 2-1')
                }),
                testCase("Should fail removal when player can't receive quantity", () => {
                    console.log('test 2-2')
                })
            ]
        }),
    ]
})