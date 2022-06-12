class TellonReporter {
    constructor(){
        throw new Error('This is a static class')
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

slz_Harness.registerModule('tellon')