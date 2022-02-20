class TellonReporter {
    static reports = [];
    static readout;
    static totalCasePasses = 0
    static totalCaseFails = 0
    static totalScenariosPassed = 0
    static totalScenariosFailed = 0
    static totalTestsPassed = 0
    static totalTestsFailed = 0

    constructor() {
        throw new Error('This is a static class')
    }

    static intialize() {
        this.totalCasePasses = 0
        this.totalCaseFails = 0
        this.totalScenariosPassed = 0
        this.totalScenariosFailed = 0
        this.totalTestsPassed = 0
        this.totalTestsFailed = 0
    }

    static parseTest(index) {
        let logs = TestLogger.logs[index]
        let length = logs.length;
        let curTest = new TellonTestReport(logs[0].data[1])
        let curReport = curTest
        let curScenario,
            curCase


        for (let i = 1; i < length; i++) {
            if (logs[i].type === 'data')
                switch (logs[i].data[0]) {
                    case 'scenario':
                        curScenario = curTest.addScenarioReport(logs[i], logs[i].data[1])
                        curReport = curScenario;
                        break;
                    case 'case':
                        curCase = curScenario.addCaseReport(logs[i], logs[i].data[1])
                        curReport = curCase;
                        break
                    default:
                        curReport.addLog(logs[i].data)
                        break;
                }
            else
                curReport.addLog(logs[i])
        }
        return curTest
    }


    static parseAllTests() {
        let list = TestLogger.logs
        let length = list.length

        this.intialize()

        for (let i = 0; i < length; i++) {
            this.reports.push(this.parseTest(i))
        }
    }

    static print(){
        let readout;
        let list = this.reports;
        let length = list.length;

        for(let i = 0; i < length; i++){
            readout += list[i].print()
        }
        
        this.readout = this.summary() + readout;
        console.log(this.readout)
    }

    static summary(){
        let readout = `*****************************************************\n`
        readout +=    `|                ***Tellon Report***\n`
        readout +=    `|                     Pass|Fail\n`
        readout +=    `|\t-Tests     ${this.totalTestsPassed}|${this.totalTestsFailed}\n`
        readout +=    `|\t-Scenarios ${this.totalScenariosPassed}|${this.totalScenariosFailed}\n`
        readout +=    `|\t-Cases     ${this.totalCasePasses}|${this.totalCaseFails}\n`  
        readout +=    `*****************************************************\n`
        return readout
    }

}

class TellonReport {
    title
    logs = []
    pass

    constructor(title) {
        this.title = title
    }

    addLog(data) {
        this.logs.push(data)
    }
}

class TellonTestReport extends TellonReport {
    reports = [];
    scenarioPasses = 0;
    scenarioFails = 0;
    casePasses = 0
    caseFails = 0
    

    constructor(title) {
        super(title)
    }

    addScenarioReport(packet, title) {
        let report = new TellonScenarioReport(packet, title)
        this.reports.push(report)

        return report
    }

    print() {
        let list = this.reports; //scenario reports
        let length = list.length;
        let readout = "";

        this.pass = true;

        for (let i = 0; i < length; i++) {
            readout += `------------------------------------------------------\n`
            readout += list[i].print()
            if (list[i].pass){
                this.scenarioPasses++
                TellonReporter.totalScenariosPassed++
            } else {
                this.scenarioFails++
                TellonReporter.totalScenariosFailed++
                this.pass = false;
            }
            this.casePasses += list[i].passes
            this.caseFails += list[i].fails
        }

        this.readout = this.summary() + readout;
        return this.readout
    }

    summary() {
        let readout = `\n------------------------------------------------------\n`
        readout += `| [TEST] ${this.title} (${this.isPass() ? '\u2713' : '\u2717'})\n`;
        readout += `|\n`
        readout +=    `|                     Pass|Fail\n`
        readout +=    `|\t-Scenarios ${this.scenarioPasses}|${this.scenarioFails}\n`;
        readout +=    `|\t-Cases     ${this.casePasses}|${this.caseFails}\n`;

        return readout;
    }

    isPass(){
        this.pass = this.scenarioFails === 0

        if(this.pass)
            TellonReporter.totalTestsPassed++
        else 
            TellonReporter.totalTestsFailed++

        return this.pass
    }

}

class TellonScenarioReport extends TellonReport {
    reports = [];
    packet
    passes
    fails

    constructor(packet, title) {
        super(title)
        this.packet = packet
    }

    addCaseReport(packet, title) {
        let report = new TellonCaseReport(packet, title)
        this.reports.push(report)

        return report
    }

    print() {
        let list = this.reports;
        let length = list.length;
        let readout = "[SCENARIO] ";

        readout += this.printHeading()
        for (let i = 0; i < length; i++) {
            readout += list[i].print()
        }

        TellonReporter.totalCasePasses += this.passes
        TellonReporter.totalCaseFails += this.fails
        this.readout = readout;

        return readout;
    }

    printHeading() {
        let tally = this.tallyReports()

        return `${this.title}\n  Passed:${tally[0]} | Failed:${tally[1]}\n`
    }

    tallyReports() {
        let passes = 0;
        let fails = 0;

        this.reports.forEach(a => {
            a.tally()
            if (a.pass)
                passes++
            else
                fails++
        })

        this.pass = fails == 0
        this.passes = passes;
        this.fails = fails;
        

        return [passes, fails]
    }


}

class TellonCaseReport extends TellonReport {
    assertionData

    constructor(packet, title) {
        super(title)
        this.packet = packet
    }

    addLog(data) {
        if (Array.isArray(data))
            return this.assertionData = data

        this.logs.push(`\t\t[LOGGER:>>] ${data.data}`)
    }

    tally() {
        this.pass = this.assertionData[0];
        return this.pass;
    }

    print() {
        let assertionData = this.assertionData;
        let passFail = this.pass ? "\u2713" : "\u2717"
        let readout = `\n\t${passFail} - ${this.title}\n${this.logs.join("\n")}`

        this.readout = readout;

        if (!this.pass)
            this.printAssertionData(assertionData[1], assertionData[2])

        return `${this.readout}\n`
    }

    printAssertionData(expected, actual) {
        this.readout += `\t\tExpected: ${expected}\n\t\tActual: ${actual}\n`
    }

}


console.log(`
___________       __    __                    
\\__    ___/____  |  |  |  |    ____    ____   
  |    | _/ __ \\ |  |  |  |   /    \\  /    \\  
  |    | \\  ___/ |  |__|  |__(<0--0>)|   |  \\ 
  |____|  \\___  >|____/|____/ \\____/ |___|  / 
              \\/                          \\/  
    `)


