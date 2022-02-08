let TestRunner = {
    tests: []
}

TestRunner.resetHooks = function () {
    this.resetCaseHooks()
    this.resetScenarioHooks()
    this.beforeAll = () => { }
}

TestRunner.resetCaseHooks = function () {
    this.beforeEachCase = () => { }
    this.afterEachCase = () => { }
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
    console.log(list)
    this.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getTestData()
        let length2 = testCases.length;
        this.beforeEachScenario()
        for (let j = 0; j < length2; j++) {
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
        this.runTest(list[i].loadTestData())
    }
}

function slz_Test(name, getTestData) {
    let obj = {
        name: name,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.tests.push(obj)
}

function scenario(title, getTestData) {
    return {
        title: title,
        getTestData: () => { return getTestData().filter(a => typeof a == 'object') }
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
    return [
        beforeAll(()=>{
            console.log('Running Before All')
        }),
        beforeEachScenario(() => {
            console.log('Staring Scenario')
        }),

        afterEachScenario(() => {
            console.log('Ending Scenario')
        }),
        scenario("Testing Add to Storage", () => {
            return [
                beforeEachCase(() => {
                    console.log('scenario 1 before each case')
                }),
                afterEachCase(() => {
                    console.log('scenario 1 after each case')
                }),
                testCase("Should add successfully when space available", () => {
                    console.log('running test case assertions for Test1 Case 1')
                }),
                testCase("Should update Individual Entry", () => {
                    console.log('running test case assertions for Test1 Case 2')
                }),
                testCase("Should update Individual Entry", () => {
                    console.log('running test case assertions for Test1 Case 3')
                })
            ]
        }),


        scenario("Testing Subtract from Storage", () => {
            return [
                beforeEachCase(() => {
                    console.log('scenario 2 before each case')
                }),
                afterEachCase(() => {
                    console.log('scenario 2 after each case')
                }),
                testCase("Should remove successfully when contents exist", () => {
                    console.log('running test case assertions for Test2 Case 1')
                }),
                testCase("Should fail removal when player can't receive quantity", () => {
                    console.log('running test case assertions for Test2 Case 2')
                })
            ]
        }),
    ]
})