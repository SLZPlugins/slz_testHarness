class TellonReporter {
    static reports = [];

    constructor() {
        throw new Error('This is a static class')
    }

    static parseTest(index) {
        let logs = TestLogger.logs[index]
        let length = logs.length;
        let curTest = new TellonTestRepot(logs[0].data[1])
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


    static parseAllTests(){
        let list = TestLogger.logs
        let length = list.length

        for(let i = 0; i < length; i++){
            this.reports.push(this.parseTest(i))
        }
    }


}

class TellonReport {
    title
    logs = []

    constructor(title) {
        this.title = title
    }

    addLog(data) {
        this.logs.push(data)
    }
}

class TellonTestRepot extends TellonReport {
    reports = [];
    constructor(title) {
        super(title)
    }

    addScenarioReport(packet, title) {
        let report = new TellonScenarioReport(packet, title)
        this.reports.push(report)

        return report
    }

    print(){
        let list = this.reports;
        let length = list.length;
        let readout = "";

        for(let i = 0; i < length; i++){
            readout += list[i].print()
        }

        this.readout = readout;
        console.log(readout)
        return readout
    }
}

class TellonScenarioReport extends TellonReport {
    reports = [];
    packet
    constructor(packet, title) {
        super(title)
        this.packet = packet
    }

    addCaseReport(packet, title) {
        let report = new TellonCaseReport(packet, title)
        this.reports.push(report)

        return report
    }

    print(){
        let list = this.reports;
        let length = list.length;
        let readout = "";

        for(let i = 0; i < length; i++){
            readout += list[i].print()
        }

        this.readout = readout;
        
        return readout;
    }
}

class TellonCaseReport extends TellonReport {
    assertionData
    pass

    constructor(packet, title) {
        super(title)
        this.packet = packet
    }

    addLog(data){
        if(Array.isArray(data))
            return this.assertionData = data
        
        this.logs.push(data.data)
    }

    print(){
        let assertionData = this.assertionData;
        let passFail = assertionData[0] ? "PASS" : "FAIL"
        let readout = `${this.logs.join("\n")}\n${passFail}\n`

        this.readout = readout;
        this.pass = assertionData[0]
        if(!this.pass)
            this.printAssertionData(assertionData[1], assertionData[2])

        return this.readout
    }

    printAssertionData(expected, actual){
        this.readout += `Expected: ${expected}\nActual: ${actual}`
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


