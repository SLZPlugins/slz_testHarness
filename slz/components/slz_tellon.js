let model = {
    name: 'tellon', 
    install: () => {
        loadBanner()

    }
}

/* ///////////////////////////////////////////////////////////////////////////
        Report Classes #report 
   /////////////////////////////////////////////////////////////////////////// */


class TellonReport extends HarnessReport {
    constructor(heading, args) {
        super(heading, args)
    }

    

    printHeading() {
        this.readout += `${this.heading}\n`
    }


}

class CaseReport extends TellonReport {
    pass;
    expected;
    actual;

    constructor(data) { //data = [pass, expected, actual]
        super("", data)
        this.pass = data[0];
        this.expected = data[1];
        this.actual = data[2];
        this.heading = HarnessReporter.heading
    }

    addReport() {
        console.log('Case Report is the lowest level of Tellon Report. You may not add a report to a Tellon CaseReport')
    }

}

class ScenarioReport extends TellonReport {
    passes = 0;
    fails = 0;

    constructor(heading, data) {
        super(heading, data)
        this.heading = heading
    }

    addReport(heading, args) {
        let report = new CaseReport(heading, args);
        this.reports.push(report)

        return report
    }

    printCaseReport(report) {
        if (report.pass) {
            this.readout += `PASS: ${report.heading}\n\n`
            this.passes++
        } else {
            this.readout += `FAIL: ${report.heading}\n`
            this.fails++
            this.readout += `    Expected: ${report.expected}\n`
            this.readout += `    Actual: ${report.actual}\n\n`
            this.pass = false;
        }

        this.readout += report.print()
    }

    printAllCaseReports() {
        this.pass = true;
        this.reports.forEach(a => {
            this.printCaseReport(a)
        })
    }

}

class TestReport extends TellonReport {
    scenarioPasses = 0;
    scenarioFails = 0;
    casePasses = 0;
    caseFails = 0;

    constructor(heading, data) {
        super(heading, data)
    }

    addReport(heading, data) {
        let report = new ScenarioReport(heading, data)

        this.reports.push(report)
        return report
    }

    printScenarioReport(report) {
        if (report.pass) {
            this.scenarioPasses++
        } else {
            this.scenarioFails++
        }

        report.printAllCaseReports()
        
        this.casePasses += report.passes
        this.caseFails += report.fails
        return report.readout
    }

    printAllScenarioReports() {
        let list = this.reports;
        let length = list.length;
        let title = ""
        let results = ""
        let readout = "";

        this.pass = true;

        for (let i = 0; i < length; i++) {
            results = this.printScenarioReport(list[i])
            title = `| SCENARIO: ${list[i].heading} (${list[i].passes}|${list[i].fails}) --${list[i].pass ? 'PASS' : 'FAIL'}\n`
            readout += "------------------------------------------------\n"
            readout += `${title}`;
            readout += "------------------------------------------------\n"
            readout += results;
            readout += "\n"

            this.pass = list[i].pass ? this.pass : false;
        }

        this.readout += `Scenarios Passed: ${this.scenarioPasses}    Scenarios Failed: ${this.scenarioFails}\n\n`
        this.readout += readout;

        return this.readout
    }
}

/* ///////////////////////////////////////////////////////////////////////////
        Reporter Class #reporter #rtr #rpr 
   /////////////////////////////////////////////////////////////////////////// */
class TellonReporter extends HarnessReporter {
    static scenarioPasses = 0;
    static scenarioFails = 0;
    static casePasses = 0;
    static caseFails = 0;
    static reportLevel = "Test";

    constructor() {
        throw new Error('This is a static class')
    }

    static print(){
        this.printAllReports()
    }

    static createReport(heading, args) {
        //if the first arg is a boolean, this will be considered a case report
        let report

        if (typeof heading == 'undefined') {
            report = this.createTestReport()
        }
        else if (args.length) {
            args.unshift(heading)
            report = this.createCaseReport(args)
        }
        else {
            report = this.createScenarioReport(heading, args)
        }

        this.currentReport = report
    }

    static createTestReport() {
        let report = new TestReport()

        this.reports.push(report)
        this.reportLevel = "Test"
        return report
    }

    static createScenarioReport(heading, args) {
        let currentTestReport = this.getCurrentTestReport();
        let scenarioReport = currentTestReport.addReport(heading, args)

        this.reportLevel = "Scenario"
        return scenarioReport;
    }

    static createCaseReport(heading, args) {
        let currentScenarioReport = this.getCurrentScenarioReport()

        this.reportLevel = "Case"
        currentScenarioReport.addReport(heading, args)
        currentScenarioReport.currentReport().logs = [].concat(currentScenarioReport.logs)
        currentScenarioReport.logs = []
    }

    static currentReport() {
        switch (this.reportLevel) {
            case 'Scenario':
                return this.getCurrentScenarioReport()
            case 'Case':
                return this.getCurrentCaseReport()
            default:
                return this.getCurrentTestReport()
        }
        return this.reports[this.reports.length - 1]
    }

    static getCurrentTestReport() {
        return this.reports[this.reports.length - 1]
    }

    static getCurrentScenarioReport() {
        let currentTestReport = this.getCurrentTestReport();

        return currentTestReport.currentReport()
    }

    static getCurrentCaseReport() {
        let currentScenarioReport = this.getCurrentScenarioReport();

        return currentScenarioReport.currentReport()
    }

    static printAllReports() {
        let list = this.reports;
        let length = list.length;
        let summary;
        let header = "\n\n==================Test Results ==================\n"
        let readout = ""
        //Print all tests in the Tellon Reporter's reports array
        for (let i = 0; i < length; i++) {
            readout += list[i].heading + "\n\n";
            readout += list[i].printAllScenarioReports()
            this.scenarioPasses += list[i].scenarioPasses
            this.scenarioFails += list[i].scenarioFails
            this.casePasses += list[i].casePasses
            this.caseFails += list[i].caseFails
        }

        readout = header + this.summary() + readout
        readout += "================================================="
        console.log(readout)
    }

    static getTestPasses() {
        let list = this.reports;
        let length = list.length;
        let pass = 0;
        let fail = 0;
        for (let i = 0; i < length; i++) {
            if (list[i].pass) {
                pass++
            } else {
                fail++
            }
        }

        return [pass, fail]
    }

    static summary() {
        let str = "--Summary--\n";
        let sPass = this.scenarioPasses;
        let sFails = this.scenarioFails;
        let sTotal = sPass + sFails
        let sPercentage = sPass / sTotal;
        let cPass = this.casePasses;
        let cFails = this.caseFails;
        let cTotal = cPass + cFails;
        let cPercentage = cPass / cTotal;
        let tPassFail = this.getTestPasses()
        let tTotal = tPassFail[0] + tPassFail[1]
        let tPercentage = tPassFail[0] / tTotal;

        str += `Tests:     ${tPercentage.toFixed(2).substr(2)}% (${tPassFail[0]}|${tPassFail[1]})\n`
        str += `Scenarios: ${sPercentage.toFixed(2).substr(2)}% (${sPass}|${sFails})\n`
        str += `Cases:     ${cPercentage.toFixed(2).substr(2)}% (${cPass}|${cFails})\n\n\n`

        return str
    }

    static resetResults() {
        this.scenarioFails = 0;
        this.scenarioPasses = 0;
        this.caseFails = 0;
        this.casePasses = 0;
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
