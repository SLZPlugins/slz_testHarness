

/*
___________       __    __                    
\\__    ___/____  |  |  |  |    ____    ____   
  |    | _/ __ \\ |  |  |  |   /    \\  /    \\  
  |    | \\  ___/ |  |__|  |__(<0--0>)|   |  \\ 
  |____|  \\___  >|____/|____/ \\____/ |___|  / 
              \\/                          \\/  
*/


class TellonReporter {
    constructor(){
        throw new Error('This is a static class')
    }
}


slz_Harness.addafterAllTestHook(()=>{console.log('Hi I am Tellon and I am telling on you!')})

slz_Harness.registerModule('tellon')