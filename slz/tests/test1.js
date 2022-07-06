sinot.createTest("Test A", () => {
    
    //can scope varibles to entire test instace

    let logger = slz_Harness.logger;
    return [
        sinot.scenario("Testing Asserts", () => {
            return [

                //assertTrue             
                sinot.testCase("Check assertTrue is true", () => {
                    rmAssert.assertTrue(true)
                }),             
                sinot.testCase("Check assertTrue is false", () => {
                    rmAssert.assertTrue(false);
                }),     
                
                //assertFalse       
                sinot.testCase("Check assertFalse is true", () => {
                    rmAssert.assertFalse(false);
                }),   
                sinot.testCase("Check assertFalse is false", () => {
                    rmAssert.assertFalse(true);
                }),

                //assertEquals
                sinot.testCase("Check assertEquals is true", () => {
                    let expected = 10;
                    let actual = 10;
                    rmAssert.assertEquals(expected, actual)
                }),
                sinot.testCase("Check assertEquals is false", () => {
                    let expected = 10;
                    let actual = 9;
                    rmAssert.assertEquals(expected, actual)
                }),

                //assertNotEquals
                sinot.testCase("Check assertNotEquals is true", () => {
                    let expected = 10;
                    let actual = 9;
                    rmAssert.assertNotEquals(expected, actual)
                }),
                sinot.testCase("Check assertNotEquals is false", () => {
                    let expected = 10;
                    let actual = 10;
                    rmAssert.assertNotEquals(expected, actual)
                }),

                //assertNull
                sinot.testCase("Check assertNull is true", () => {
                    rmAssert.assertNull(null);
                }),
                sinot.testCase("Check assertNull is false", () => {
                    rmAssert.assertNull({objName:"name"});
                }),

                //assertNotNull
                sinot.testCase("Check assertNotNull is true", () => {
                    rmAssert.assertNotNull({objName:"name"});
                }),
                sinot.testCase("Check assertNotNull is false", () => {
                    rmAssert.assertNotNull(null);
                }),

                //assertString
                sinot.testCase("Check assertString is true", () => {
                    rmAssert.assertString("It's a string");
                }),
                sinot.testCase("Check assertString is false", () => {
                    rmAssert.assertString(5);
                }),

                //assertNumber
                sinot.testCase("Check assertNumber is true", () => {
                    rmAssert.assertNumber(5);
                }),
                sinot.testCase("Check assertNumber is false", () => {
                    rmAssert.assertNumber("It's a string");
                }),

                //assertObject
                sinot.testCase("Check assertObject is true", () => {
                    rmAssert.assertObject({name:"objName"});
                }),
                sinot.testCase("Check assertObject is false", () => {
                    rmAssert.assertObject("It's a string");
                }),

                //assertBoolean
                sinot.testCase("Check assertBoolean is true", () => {
                    rmAssert.assertBoolean(false);
                }),
                sinot.testCase("Check assertBoolean is false", () => {
                    rmAssert.assertBoolean("It's a string");
                }),

                //assertFunction
                sinot.testCase("Check assertFunction is true", () => {
                    rmAssert.assertFunction(() => {console.log("it's a function")});
                }),
                sinot.testCase("Check assertFunction is false", () => {
                    rmAssert.assertFunction({name:"objName"});
                }),

                //assertInstance
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
                sinot.testCase("$gameMessage.hasText", () => {
                    rmAssert.assertFalse($gameMessage.hasText());
                }),
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
