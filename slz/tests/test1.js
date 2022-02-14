console.log('//////////////////////////////////////0000')

sinot_Test("Test A", 

//RPG Maker Plugins,
["sp_Core"],
//Assertion Engines
['rmAssert'], 
//Plugins
[],
//Tests
() => {
    
    //can scope varibles to entire test instace
    let testLevelVar = 'Running Before All'
    return [
        beforeAll(()=>{
            console.log('This will run once, before the first scenario runs')
        }),
        beforeEachScenario(()=>{
            console.log('This will run before each test scenario runs')
        }),
        afterEachScenario(()=>{
            console.log('This will run before each test scenario runs')
        }),
        scenario("Testing Add to Storage", () => {
            //can scope varibles to individual scenario
            let scenarioLevelVar = 'first before each case'
            return [
                beforeEachCase(()=>{
                    console.log('this will run before each case, just for this scenario')
                }),
                afterEachCase(()=>{
                    console.log('this will run after each case, just for this scenario')
                }),
                testCase("Check Length is greater than one", () => {
                    rmAssert.assertTrue(10 > 1)
                }),
                testCase("Amount in inventory should be decremented", () => {
                    let expected = 10;
                    let actual = 9;
                    rmAssert.assertEquals(expected, actual)
                }),
                testCase("Should be an instance of Scene_Battle", () => {
                    let expected = SceneManager._scene;
                    let actual = Scene_Battle
                    rmAssert.assertInstance(expected, actual)
                })
            ]
        }),


        scenario("Testing Subtract from Storage", () => {
            return [
                testCase("Should remove successfully when contents exist", () => {
                    rmAssert.assertNotEquals(10, 10)
                }),
                testCase("Some prop should be null", () => {
                    rmAssert.assertNull(null)
                })
            ]
        }),
    ]
})
