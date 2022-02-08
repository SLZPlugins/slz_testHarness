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