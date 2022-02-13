# slz_testHarness
A simple testing suite designed to work in RPG Maker MV and MZ (currently on MZ Model, MV testing to come)

## Overview
The purpose of this plugin is to act as a harness that supports testing of RPG Maker JavaScript plugins. 

Far too many plugins are made without Unit Testing, but when someone goes to use popular JS unit
testing frameworks, they may find themselves in need of constant mocking and stubbing just to get
things going. Others might just not want to go through installing other testing frameworks just for
testing their RM code. 

This harness is meant to be __light__ and __extensible__, while allowing for testing during an actual playtest. 
This takes away the need to stub, mock or otherwise preload RM or dependent plugin code just to test. 
Currently, all tests are written in external files using ***sinotJS*** run and printed through the console.

This document will explain how to use sinotJS to easily write tests to execute with the harness


## Setting up slz_TestHarness on your project
slz_TestHarness.js is the only actual RM plugin you'll need to install like a normal RM plugin.
Once added, use the params to set the locations for the following:
* Test Directory
* Engines
* Test Plugins


### Test Directory
In order to run tests, you'll need to specify a directory in the plugin params. The test directory
can be anywhere on your machine. ***Only folders and your test files*** should be within your test
directory. You can have any amount of test files, sub folders, sub sub folders, so on. Just know
any files found at all within your test directory and it's sub-directories will be considered tests When the
TestFileManager reads it.

### Engines 
Engines are most frequently going to be javascript files that define assertion functions, to assist
in testing. The default engine provided with this project is slz_Assertions, which makes the library
***rmAssert*** available whenn enabled. When adding an engine, you must look at the documentation
and find the name associated with that engine, so the harness knows how other plugins or tests will
refer to it. The default plugin, slz_Assertions includes the following code

    window.rmAssert = rmAssert
    
This is the name it should be referred to with, and the name that should be specified when configuring it
in the Engine section. The point is, you would normally find this name from the documentation. In the 
future, this will likely not be necessary, and the name setting will be used for something else. For
now, it is required.

### Plugins
Plugins (when talking about this test harness) are considered add ons that aren't exclusively about
asserting or validating tests. Truthfully, it should be ok to load an Engine or a Plugin as either
or, but in the future it's important to know that Engines shouldn't have dependencies. Plugins, on 
the other hand may have dependencies.
The name of a plugin should be in the documentation for that plugin, but can be found by looking at the code for the window assignment, like below

    windows.slz_sandbox = slz_sandbox
    
This is the name it should be referred to with, and the name that should be specified when configuring it
in the Engine section. The point is, you would normally find this name from the documentation. In the 
future, this will likely not be necessary, and the name setting will be used for something else. For
now, it is required.



## Creating your own test


Add a .js file to the test folder. It can be anywhere within the test folder specified in the plugin
params, including inside of an internal folder. 

Setting up a test will be the same every time, and the process will be documented in the slz_TestHarness.js
help file. 


There are __five__ arguments required for a Test definition
-Test Name
-Required RM Plugins
-Required Engines
-Required Test Plugins
-Test Code

You should start with the following:

    slz_Test(
    
    )

Next, we'll add the five arguments

    slz_Test(
        //Title
        "My First Test",
        
        //RPG Maker Plugins Your engines or plugins require
        ['sp_Core'],
        
        //Required Engines for this test
        ['rmAssert'],
        
        //Required Test Plugins for this test
        ['slz_sandbox'],
        
        ()=>{
            return [ 
            
            ]
        }
    )
    
If you don't have required RM Plugins, Test Plugins or Engines, leave their
associated arrays empty. You __must__ have the arrays, even if they are empty.

### Scenarios and Test Cases
A single test is made up of one or more 'scenarios'. 
A single scenario is made up of one or more 'test cases'.

Actual tests occur in test cases. These are where you make your assertions. 
Scenarios are containers for tests that are related. For example, if testing 
a storage plugin, you might have a Test that was meant to test your Storage's 
interactions. 

One scenario might be 'Test Adding Items'. One test case within
that scenario might be adding to storage when there is enough space.
Another test case might test adding to storage when there isn't enough space. 
A third test might make sure that some other restriction your storage plugin
has is working correctly. 

Another scenario could have similar cases, but testing removing storage. 
How you organize them is up to you, but you can name a test, each scenario and 
each test case, so keep in mind your reports after running tests will be as
clear as your tests are organized.

## Adding a scenario

### Syntax for a scenario in __sinotJS__ 
    scenario("Your scenario title for the report", ()=>{
        return [

        ]
    })


### Adding multiple test cases
Inside of this arrow function, you can add as many scenarios as you'd like. 
Multiple test scenarios must be separated by a comma.

    scenario("Test adding to storage", ()=>{
        return [

        ]
    }),
    scenario("Test removing from storage", ()=>{
        return [

        ]
    })



## Add a test case
### Syntax for a test case in __sinotJS__ 


    testCase("Should allow adding item when space is available", ()=>{

    })



### Adding multiple test cases
Inside of this arrow function, you can set up and create your tests. 
Multiple test cases can be inside of each scenario, and they are simply
separate by a comma

    testCase("Should allow adding item when space is available", ()=>{
        //Your test code
    }),
    
    testCase("Should NOT allow adding if space is not available", ()=>{
        //Your test code
    })


It's really just like writing a function, because it literaly is writing
a function. You can create local variables, or access any ones that are 
in scope at the time. 

There are also five methods to help facilitate tests. 
beforeEachCase
beforeEachScenario
beforeAll
afterEachCase
afterEachScenario

Each of them accepts a single argument, a function where you can write code
to fire on the trigger described in each name. For example, to have a 
function run before each individual case


    beforeEachCase(()=>{
        console.log('This would run before each and every case')
    })


If you are viewing this document on the slz_TestHarness GitHub repo, 
you can observe a sample test file included, called test1.js. You can see
all of the above calls being used, although they aren't necessary. 


Here's an example of that completed test.

    slz_Test("Test A", 
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


## Running Your Tests
Running tests is simple.
-Launch your game
-Open the console (usually F12, might be different for you)
-Enter the following

    TestRunner.run()

That's it. Your tests will run, and if your Engine provides reporting, a report
of your results will print out to the console. 

## Understanding the current state
This harness allows you to set up tests to work with live situations. If you want t
to test what happens when your character is standing at a certain place, 
holding a certain item, on a certain map...you can do that. Just make it happen
in the playtest, and anything you're referencing in your tests that will check
the runtime environment. 

For example, you can refer to $gamePlayer and $gameSystem in your tests, because
the game must be running to launch the tests anyway. Of course, what you refer 
to must be in scope. If you're testing a menu, you should be in that menu, etc. 

## Reporting Bugs
Please report any bugs in the comments here, and they will be addressed as soon 
as possible!

## Requesting an Engine or Test Plugin - Build-in
If you'd like to make one of your own engines or plugins available here on the repo,
please comment and let us know, we'll get in touch. There are certain protocols, 
and we'd prefer people not to push to this repo. However we'd be happy to do a 
code review and set up a build-in to allow your add on to become available here!

