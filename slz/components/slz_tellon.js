let model = {
    name: 'tellon', 
    install: () => {
        loadBanner()

    }
}




function loadBanner() {
    console.log(`
___________       __    __                    
\\__    ___/____  |  |  |  |    ____    ____   
  |    | _/ __ \\ |  |  |  |   /    \\  /    \\  
  |    | \\  ___/ |  |__|  |__(<0--0>)|   |  \\ 
  |____|  \\___  >|____/|____/ \\____/ |___|  / 
              \\/                          \\/  
    `)
}

let manifest = {
    TellonReport: TellonReport,
    CaseReport: CaseReport,
    TestReport: TestReport,
    ScenarioReport: ScenarioReport
}

requireLanguage('sinot')
requirePlugins('sp_Core')
registerReporter(model, manifest, TellonReporter)
