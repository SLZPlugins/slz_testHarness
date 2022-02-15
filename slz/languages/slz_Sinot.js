let model = {
    name:"sinot",
    testLevel:'test',
    beforeAll:()=>{},
    beforeEachCase:()=>{},
    beforeEachScenario:()=>{},
    afterEachCase:()=>{},
    afterEachScenario:()=>{},
    install:()=>{
        loadBanner()
    }
}

function loadBanner(){
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
}

function sinot_Test(title, getTestData) {
    console.log(`Found sinot_Test: ${title}`)
    let obj = {
        title: title,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    TestRunner.addTest(obj)
}

function resetHooks() {
    resetCaseHooks()
    resetScenarioHooks()
    sinot.model.beforeAll = () => { }
}

function resetCaseHooks() {
    sinot.model.beforeEachCase = () => { }
    sinot.model.afterEachCase = () => { }
    sinot.model.beforeAll = () => { }
}

function resetScenarioHooks() {
    sinot.model.beforeEachScenario = () => { }
    sinot.model.afterEachScenario = () => { }
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
    sinot.model.beforeAll = f;
}

function beforeEachCase(f) {
    sinot.model.beforeEachCase = f
}

function afterEachCase(f) {
    sinot.model.afterEachCase = f
}

function beforeEachScenario(f) {
    sinot.model.beforeEachScenario = f
}

function afterEachScenario(f) {
    sinot.model.afterEachScenario = f
}

function runTest(list) { //list is test file using Sinot.js
    let length = list.length;
    let reporter = HarnessReporter;
    //list is array of Scenarios for individual test file
    sinot.model.reportLevel = "test"
    sinot.model.beforeAll()
    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        reporter.createReport(scenario.title)
        sinot.model.reportLevel = "scenario"
        sinot.model.scenarioHeading = scenario.title //<-- Don't think this was even used in POC
        sinot.model.beforeEachScenario()

        for (let j = 0; j < length2; j++) {
            sinot.model.reportLevel = "case"
            HarnessReporter.heading = testCases[j].title

            sinot.model.beforeEachCase()

            testCases[j].testCaseRunner();
            
            sinot.model.afterEachCase()
            
        }
        resetCaseHooks()
        sinot.model.afterEachScenario()
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

requireComponents('tellon')
registerLanguage(model, manifest)