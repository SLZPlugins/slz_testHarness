# slz_testHarness
A simple testing suite designed to work in RPG Maker MV and MZ

Current POC Test instructions:
-Configure plugin params to have filepaths for main test folder and assertions engine
-point assertions engine filepath to slz_Assertions.js
-plugin sp_Core version included in this build, order before this plugin
-launch game
-in console, enter the following commands

--TestFileManager.loadAssertionEngines()
--TestFileManager.loadTests()
--TestRunner.runAllTests()

Afterward, check the TestManager.testReports object, to dig in and see the created test reports,
scenario reports and case reports. Currently, only one case report will be generated, on the 
first scenario of the first test. 


Creating your own test


Add a .js file to the test folder. It can be anywhere within the test folder specified in the plugin
params, including inside of an internal folder. 

Add the following lines:
---
slz_Test("Testing so-and-so", ()=>{

})
----

All of your test code will go inside of this block. The test will be 
titled in the Report with whatever you provide as the first argument
to slz_Test. In the code above, the title would be "Testing so-and-so".

Tests are made of Scenarios. 
Scenarios are like containers for actual tests. You put related tests together in 
a Scenario. 
Add a scenario block, and give it a title

scenario("Adding an item to Storage", ()=>{
    return [

    ]
})

The syntax is a little strange, but you're essentially creating an array
of test cases, which will all be represented by this scenario. Just know
that you write your actual test cases inside of this array, with each test
case separated by a comma (just like array elements, of course)

Add a test to this scenario

testCase("Should allow adding item when space is available", ()=>{

})


The syntax should seem familiar now. We're calling a class or function, and passing
it two arguments. The first is a title for the thing we're creating, and the second
is a function.

Here, you can set up and create your tests. Later on, there will be spies and a 
default sandbox plugin, but for now, here's an example of a test.

testCase("Should allow adding item when space is available", ()=>{
    let startingAmount = $gamePlayer.customStorage.count("Potion")
    $gamePlayer.customStorage.add("Potion", 1)
    let expected = startingAmount + 1
    let actual = $gamePlayer.customStorage.count("Potion")
    
    rmAssert.assertEquals(expected, actual)
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


Assertions in rmAssert handle reporting themselves, so all of the tests
you write using rmAssert will create Report objects when your tests run. 
However, currently only CaseReports actually hold test result data. 

Later, Scenario and testReport will have functions to aggregate the data
contained in their case reports. 
