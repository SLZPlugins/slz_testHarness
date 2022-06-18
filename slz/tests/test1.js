// requireLanguage('sinot')
// requirePlugins('sp_Core')
sinot.createTest("Test A", () => {
    
    //can scope varibles to entire test instace

    let logger = slz_Harness.logger;
    return [
        sinot.scenario("Testing Asserts", () => {
            return [
                
                sinot.testCase("Check assertFalse is true", () => {
                    rmAssert.assertFalse(false);
                }),   
                sinot.testCase("Check assertFalse is false", () => {
                    rmAssert.assertFalse(true);
                }),             
                sinot.testCase("Check assertTrue is true", () => {
                    rmAssert.assertTrue(true)
                }),             
                sinot.testCase("Check assertTrue is false", () => {
                    rmAssert.assertTrue(false);
                }),
                sinot.testCase("Check assertEquals is false", () => {
                    let expected = 10;
                    let actual = 9;
                    rmAssert.assertEquals(expected, actual)
                }),
                sinot.testCase("Should be an instance of Scene_Battle", () => {
                    let expected = SceneManager._scene;
                    let actual = Scene_Battle
                    rmAssert.assertInstance(expected, actual)
                }),
                sinot.testCase("Check assertNotNull is true", () => {
                    rmAssert.assertNotNull({objName:"name"});
                }),
                sinot.testCase("Check assertNotNull is false", () => {
                    rmAssert.assertNotNull(null);
                }),
                sinot.testCase("Check assertInstance is true", () => {
                    let sm = SceneManager._scene;
                    rmAssert.assertInstance(sm._messageWindow, Window_Base);
                }),
                sinot.testCase("Check assertInstance is false", () => {
                    rmAssert.assertInstance($gameParty, Window_Base);
                })
            ]
        }),

        sinot.scenario("Testing Subtract from Storage", () => {
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
