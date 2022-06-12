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

class sinot extends iTestLanguage {
    constructor(testObject){
        super()

        this.title = testObject.title
        this.loadTestData = testObject.loadTestData
        this.testRunner = sinot.runTest;
    }

    
}

sinot.createTest = function(title, getTestData){
    console.log(`Found sinot_Test: ${title}`)
    let obj = {
        title: title,
        loadTestData: () => { return getTestData().filter(a => typeof a == 'object') }
    }

    slz_Harness.addTest(new sinot(obj))
}

sinot.scenario = function(title, getScenarioData) {
    return {
        title: title,
        getScenarioData: () => { return getScenarioData().filter(a => typeof a == 'object') }
    }
}

sinot.testCase = function(title, testCaseRunner) {
    return {
        title: title,
        testCaseRunner: testCaseRunner
    }
}

sinot.runTest = function(list) { //list is test file using Sinot.js
    let length = list.length;
    let logger = slz_Harness.logger
    //list is array of Scenarios for individual test file
    this.reportLevel = "test"

    for (let i = 0; i < length; i++) {
        let scenario = list[i]
        let testCases = scenario.getScenarioData()
        let length2 = testCases.length;

        logger.beginSegment(`SCENARIO - ${scenario.title}`)
        logger.log(scenario.title)
        this.reportLevel = "scenario"
        this.scenarioHeading = scenario.title //<-- Don't think this was even used in POC

        for (let j = 0; j < length2; j++) {
            this.reportLevel = "case"
            logger.beginSegment(`TEST CASE - ${testCases[j].title}`)
            logger.log(testCases[j].title)

            testCases[j].testCaseRunner();
            logger.endSegment(testCases[j].title)
        }

        logger.endSegment(`SCENARIO - ${scenario.title}`)
    }
}

slz_Harness.registerModule('sinot')