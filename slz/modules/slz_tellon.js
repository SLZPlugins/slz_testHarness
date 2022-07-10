

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

TellonReporter.setStandardProps = function() {
    this._reports = [];
}

TellonReporter.createReport = function() {
    this._reports.push(new TellonReport(slz_Harness.logger.getLastTestFileLogs()))
    this.printLastReport()
}

TellonReporter.printLastReport = function() {
    this._reports[this._reports.length - 1].generateReport()
    this._reports[this._reports.length - 1].print()
}

TellonReporter.printAllReports = function() {
    this._reports.forEach(report => {
        report.generateReport()
        report.print()
    })
}

class TellonReport {

    constructor(logs){
        this.logs = logs;
        this.reportString = "";
    }

    generateReport() {
        let list = this.logs;
        let length = list.length;
        let current;

        for(let i = 0; i < length; i++) {
            current = list[i];
            if(current instanceof slz_AssertionRecord) {
                this.reportString += current.isPassing ? this.getPassString() : this.getFailString(current);
            } else {
                this.reportString += '\n' + current.toString();
            }
        }
    }

    getPassString() {
        return '\t\u2713' + '\n' + '\n'
    }

    getFailString(current) {
        return '\t\u274c' + '\n' + current.toString(this.indent(current)) + '\n';
    }

    print() {
        console.log(this.reportString)
    }   

    indent(log) {
        let length = log.depth == -1 ? 1 : log.depth;
        let indent = "";

        for(let i = 0; i < length; i++) {
            indent += '\t';
        }

        return indent;
    }
}

TellonReporter.setStandardProps()

slz_Harness.addAfterAllTestHook(TellonReporter.createReport.bind(TellonReporter))

slz_Harness.registerModule('tellon')