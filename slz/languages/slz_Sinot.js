let sinot = {model:{}}

/*
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

*/

function sinot_Test(title, getTestData) {
    console.log(`Found sinot_Test: ${title}`)
    let obj = {
        title: title,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    slz_Harness.addTest(obj)
}

function resetHooks() {
    resetCaseHooks()
    resetScenarioHooks()
    this.beforeAll = () => { }
}

function resetCaseHooks() {
    this.beforeEachCase = () => { }
    this.afterEachCase = () => { }
    this.beforeAll = () => { }
}

function resetScenarioHooks() {
    this.beforeEachScenario = () => { }
    this.afterEachScenario = () => { }
}


function scenario(title, getScenarioData) {
    return {
        title: title,
        getScenarioData: () => { return getScenarioData().filter(a => typeof a == 'object') }
    }
}

function testCase(title, testCaseRunner) {
    return {
        title: title,
        testCaseRunner: testCaseRunner
    }
}

function beforeAll(f) {
    this.beforeAll = f;
}

function beforeEachCase(f) {
    this.beforeEachCase = f
}

function afterEachCase(f) {
    this.afterEachCase = f
}

function beforeEachScenario(f) {
    this.beforeEachScenario = f
}

function afterEachScenario(f) {
    this.afterEachScenario = f
}

function runTest(list) { //list is test file using Sinot.js
    let length = list.length;
    let reporter = HarnessReporter;
    //list is array of Scenarios for individual test file
    this.reportLevel = "test"
    this.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        TestLogger.log(scenario.title)
        this.reportLevel = "scenario"
        this.scenarioHeading = scenario.title //<-- Don't think this was even used in POC
        this.beforeEachScenario()

        for (let j = 0; j < length2; j++) {
            this.reportLevel = "case"
            TestLogger.log(testCases[j].title)

            this.beforeEachCase()

            testCases[j].testCaseRunner();
            
            this.afterEachCase()
            
        }
        resetCaseHooks()
        this.afterEachScenario()
    }
}


let manifest = {
    sinot_Test: sinot_Test,
    scenario: scenario,
    testCase: testCase,
    beforeAll: beforeAll,
    beforeEachCase: beforeEachCase,
    beforeEachScenario: beforeEachScenario,
    afterEachCase: afterEachCase,
    afterEachScenario: afterEachScenario,
    resetHooks: resetHooks,
    resetCaseHooks: resetCaseHooks,
    resetScenarioHooks: resetScenarioHooks,
    runTest: runTest,
}


slz_Harness.registerModule('sinot')