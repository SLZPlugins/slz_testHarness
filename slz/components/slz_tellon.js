

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

TellonReporter.setStandardProps = function(){
    this._reports = [];
}

TellonReporter.createReport = function(){
    this._reports.push(new TellonReport(slz_Harness.logger.getLastTestRunLogs()))
    this.printLastReport()
}

TellonReporter.printLastReport = function(){
    this._reports[this._reports.length - 1].generateReport()
    this._reports[this._reports.length - 1].print()
}

TellonReporter.printAllReports = function(){
    this._reports.forEach(report => {
        report.generateReport()
        report.print()
    })
}



class TellonReport {

    constructor(logs){
        this.logs = logs;
        this.reportString = ""
    }

    generateReport(){
        let list = this.logs;
        let length = list.length;
        let current;

        for(let i = 0; i < length; i++){
            current = list[i];
            if(current instanceof slz_AssertionRecord){
                if(current.isPassing){
                    this.reportString += '\tPASS'
                    this.reportString += '\n'
                } else {
                    this.reportString += '\tFAIL'
                    this.reportString += '\n'
                    this.reportString += current.toString()
                }

                this.reportString += '\n'
            } else {
                this.reportString += '\n' + current.toString()
            }
        }

    }

    print(){
        console.log(this.reportString)
    }   

}

TellonReporter.setStandardProps()

slz_Harness.addafterAllTestHook(TellonReporter.createReport.bind(TellonReporter))

slz_Harness.registerModule('tellon')