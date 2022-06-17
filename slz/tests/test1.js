// requireLanguage('sinot')
// requirePlugins('sp_Core')
sinot.createTest("Test A", () => {
    
    //can scope varibles to entire test instace

    let logger = slz_Harness.logger;
    return [
        sinot.scenario("Testing Add to Storage", () => {
            return [
                
                sinot.testCase("Check Length is greater than one", () => {
                    logger.log('Test Log')
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
