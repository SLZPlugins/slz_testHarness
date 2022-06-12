// requireLanguage('sinot')
// requirePlugins('sp_Core')
sinot.createTest("Test A", () => {
    
    //can scope varibles to entire test instace
    let testLevelVar = 'Running Before All'
    let logger = slz_Harness.logger;
    return [
        // beforeAll(()=>{
        //     console.log('This will run once, before the first scenario runs')
        // }),
        // beforeEachScenario(()=>{
        //     console.log('This will run before each test scenario runs')
        // }),
        // afterEachScenario(()=>{
        //     console.log('This will run before each test scenario runs')
        // }),
        sinot.scenario("Testing Add to Storage", () => {
            //can scope varibles to individual scenario
            let scenarioLevelVar = 'first before each case'
            return [
                // beforeEachCase(()=>{
                //     console.log('this will run before each case, just for this scenario')
                // }),
                // afterEachCase(()=>{
                //     console.log('this will run after each case, just for this scenario')
                // }),
                sinot.testCase("Check Length is greater than one", () => {
                    logger.log('poooooooo')
                    console.log('happening')
                    rmAssert.assertTrue(10 > 1)
                }),
                sinot.testCase("Amount in inventory should be decremented", () => {
                    let expected = 10;
                    let actual = 9;
                    rmAssert.assertEquals(expected, actual)
                }),
                sinot.testCase("Should be an instance of Scene_Battle", () => {
                    let expected = SceneManager._scene;
                    let actual = Scene_Battle
                    rmAssert.assertInstance(expected, actual)
                })
            ]
        }),

        sinot.scenario("Testing Subtract from Storage", () => {
            logger.log('Before second scenario')
            return [
                sinot.testCase("Should remove successfully when contents exist", () => {
                    rmAssert.assertNotEquals(10, 10)
                }),
                sinot.testCase("Some prop should be null", () => {
                    rmAssert.assertNull(null)
                })
            ]
        }),
    ]
})
