let sinot = {};

console.log(`
                  iiii                                          tttt                           jjjj                 
                 i::::i                                      ttt:::t                          j::::j                
                  iiii                                       t:::::t                           jjjj                 
                                                             t:::::t                                                
    ssssssssss  iiiiiinnnn  nnnnnnnn      ooooooooooo  ttttttt:::::ttttttt                   jjjjjjj   ssssssssss   
  ss::::::::::s i:::::n:::nn::::::::nn  oo:::::::::::oot:::::::::::::::::t                   j:::::j ss::::::::::s  
ss:::::::::::::s i::::n::::::::::::::nno:::::::::::::::t:::::::::::::::::t                    j::::ss:::::::::::::s 
s::::::ssss:::::si::::nn:::::::::::::::o:::::ooooo:::::tttttt:::::::tttttt                    j::::s::::::ssss:::::s
 s:::::s  ssssss i::::i n:::::nnnn:::::o::::o     o::::o     t:::::t                          j::::js:::::s  ssssss 
   s::::::s      i::::i n::::n    n::::o::::o     o::::o     t:::::t                          j::::j  s::::::s      
      s::::::s   i::::i n::::n    n::::o::::o     o::::o     t:::::t                          j::::j     s::::::s   
ssssss   s:::::s i::::i n::::n    n::::o::::o     o::::o     t:::::t    tttttt                j::::ssssss   s:::::s 
s:::::ssss::::::i::::::in::::n    n::::o:::::ooooo:::::o     t::::::tttt:::::t                j::::s:::::ssss::::::s
s::::::::::::::si::::::in::::n    n::::o:::::::::::::::o     tt::::::::::::::t                j::::s::::::::::::::s 
 s:::::::::::ss i::::::in::::n    n::::noo:::::::::::oo        tt:::::::::::tt                j::::js:::::::::::ss  
  sssssssssss   iiiiiiiinnnnnn    nnnnnn  ooooooooooo            ttttttttttt                  j::::j sssssssssss    
                                                                                              j::::j                
                                                                                    jjjj      j::::j                
                                                                                   j::::jj   j:::::j                
                                                                                   j::::::jjj::::::j                
                                                                                    jj::::::::::::j                 
                                                                                      jjj::::::jjj                  
                                                                                         jjjjjj
    `)

function sinot_Test(title, getTestData) {
    console.log(`Found sinot_Test: ${title}`)
    let obj = {
        title: title,
        type: 'test',
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.addTest(obj)
}

function resetHooks() {
    resetCaseHooks()
    resetScenarioHooks()
    sinot.beforeAll = () => { }
}

function resetCaseHooks() {
    sinot.beforeEachCase = () => { }
    sinot.afterEachCase = () => { }
    sinot.beforeAll = () => { }
}

function resetScenarioHooks() {
    sinot.beforeEachScenario = () => { }
    sinot.afterEachScenario = () => { }
}


function scenario(title, getScenarioData) {
    return {
        title: title,
        type: 'scenario',
        getScenarioData: () => { return getScenarioData().filter(a => typeof a == 'object') }
    }
}

function testCase(title, testCaseRunner) {
    return {
        title: title,
        type: 'case',
        testCaseRunner: testCaseRunner
    }
}

function beforeAll(f) {
    sinot.beforeAll = f;
}

function beforeEachCase(f) {
    sinot.beforeEachCase = f
}

function afterEachCase(f) {
    sinot.afterEachCase = f
}

function beforeEachScenario(f) {
    sinot.beforeEachScenario = f
}

function afterEachScenario(f) {
    sinot.afterEachScenario = f
}

function runTest(list) { //list is test file using Sinot.js
    let length = list.length;
    //list is array of Scenarios for individual test file
    sinot.reportLevel = "test"
    sinot.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        TestLogger.addData(scenario.type, scenario.title)
        sinot.reportLevel = "scenario"
        sinot.scenarioHeading = scenario.title //<-- Don't think this was even used in POC
        sinot.beforeEachScenario()

        for (let j = 0; j < length2; j++) {
            sinot.reportLevel = "case"
            TestLogger.addData(testCases[j].type, testCases[j].title)

            sinot.beforeEachCase()

            testCases[j].testCaseRunner();
            
            sinot.afterEachCase()
            
        }
        resetCaseHooks()
        sinot.afterEachScenario()
    }
}

TestRunner.languages.push(runTest)
resetHooks()