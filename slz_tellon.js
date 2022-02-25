function TellonReporter() {
    throw new Error('This is a static class')
}

TellonReporter.reports = [];
TellonReporter.readout;
TellonReporter.totalCasePasses = 0
TellonReporter.totalCaseFails = 0
TellonReporter.totalScenariosPassed = 0
TellonReporter.totalScenariosFailed = 0
TellonReporter.totalTestsPassed = 0
TellonReporter.totalTestsFailed = 0

TellonReporter.intialize = function () {
    this.totalCasePasses = 0
    this.totalCaseFails = 0
    this.totalScenariosPassed = 0
    this.totalScenariosFailed = 0
    this.totalTestsPassed = 0
    this.totalTestsFailed = 0
}


TellonReporter.parseTest = function (index) {
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

TellonReporter.parseAllTests = function () {
    let list = TestLogger.logs
    let length = list.length

    this.reports = []

    for (let i = 0; i < length; i++) {
        this.reports.push(this.parseTest(i))
    }
}

TellonReporter.print = function (reportIndex, numberOfReports) {
    this.intialize()
    let readout;
    reportIndex = typeof reportIndex != 'undefined' ? reportIndex : 0
    numberOfReports = numberOfReports || this.reports.length;
    let list = this.reports.slice(reportIndex, reportIndex + numberOfReports);
    let length = list.length;
    let summary;

    for (let i = 0; i < length; i++) {
        readout += list[i].print()
    }

    summary = this.summary()
    this.readout = summary + readout + summary;
    console.log(this.readout)
}

TellonReporter.summary = function () {
    let readout = `*****************************************************\n`
    readout += `|                ***Tellon Report***\n`
    readout += `|                     Pass|Fail\n`
    readout += `|\t-Tests     ${this.totalTestsPassed} | ${this.totalTestsFailed}\n`
    readout += `|\t-Scenarios ${this.totalScenariosPassed} | ${this.totalScenariosFailed}\n`
    readout += `|\t-Cases     ${this.totalCasePasses} | ${this.totalCaseFails}\n`
    readout += `*****************************************************\n`
    return readout
}

TellonReporter.getSquashedReport = function () {
    return this.readout.replace(/^\s*[\r\n]/gm, '')
}

TellonReporter.exportLogs = function (filename) {
    let report = this.getSquashedReport()
    filename = filename || 'tellonLog'
    let path = `js/plugins/TestLogs/${filename}.md`

    report = this.formatMarkdown(report)
    require("fs").writeFile(path, report, (e) => { if (e) throw e; console.log('complete') });
}

TellonReporter.formatMarkdown = function (report) {
    let data = report.split('\n')
    console.log(data.length)
    let mdPrintout = data.map(a => {
        a = a.replace('|', '')
        a = a.replaceAll('*', '\*')
        a = a.replace('------------------------------------------------------', '')

        if (a.contains('[SCENARIO]'))
            return "## " + a
        else if (a.contains('[TEST]'))
            return "# " + a
        else if (a.contains('-Test') || a.contains('-Scen') || a.contains('-Case') || a.contains('***'))
            return a.trim()
        else if (!a.contains('Pass|Fail') && !a.contains('undefined'))
            return '\t' + a
        else {
            console.log(a)
            return undefined
        }
    })

    console.log(mdPrintout.length)
    mdPrintout = mdPrintout.filter(a => {
        return typeof a != 'undefined' && a.length
    })

    return mdPrintout.join('  \n')
}


function TellonReport(title) {
    this.title = title
    this.logs = []
    this.pass = false;
}

TellonReport.prototype.addLog = function (data) {
    this.logs.push(data)
}


function TellonTestReport(title) {
    this.reports = [];
    this.logs = []
    this.scenarioPasses = 0;
    this.scenarioFails = 0;
    this.casePasses = 0
    this.caseFails = 0
    this.title = title;
}

TellonTestReport.prototype = Object.create(TellonReport.prototype)

TellonTestReport.prototype.addScenarioReport = function (packet, title) {
    let report = new TellonScenarioReport(packet, title)
    this.reports.push(report)

    return report
}

TellonTestReport.prototype.print = function () {
    let list = this.reports; //scenario reports
    let length = list.length;
    let readout = "";

    this.pass = true;

    for (let i = 0; i < length; i++) {
        readout += `------------------------------------------------------\n`
        readout += list[i].print()
        if (list[i].pass) {
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

TellonTestReport.prototype.summary = function () {
    let readout = `\n------------------------------------------------------\n`
    readout += `| [TEST] ${this.title} (${this.isPass() ? '\u2713' : '\u2717'})\n`;
    readout += `|\n`
    readout += `|                     Pass|Fail\n`
    readout += `|\t-Scenarios ${this.scenarioPasses} | ${this.scenarioFails}\n`;
    readout += `|\t-Cases     ${this.casePasses} | ${this.caseFails}\n`;

    return readout;
}

TellonTestReport.prototype.isPass = function () {
    this.pass = this.scenarioFails === 0

    if (this.pass)
        TellonReporter.totalTestsPassed++
    else
        TellonReporter.totalTestsFailed++

    return this.pass
}

function TellonScenarioReport(packet, title) {
    this.title = title
    this.packet = packet
    this.reports = [];
    this.logs = []
    this.packet = 0;
    this.passes = 0;
    this.fails = 0;
}

TellonScenarioReport.prototype = Object.create(TellonReport.prototype)

TellonScenarioReport.prototype.addCaseReport = function (packet, title) {
    let report = new TellonCaseReport(packet, title)
    this.reports.push(report)

    return report
}

TellonScenarioReport.prototype.print = function () {
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

TellonScenarioReport.prototype.printHeading = function () {
    let tally = this.tallyReports()

    return `${this.title}\n  Passed:${tally[0]} | Failed:${tally[1]}\n`
}

TellonScenarioReport.prototype.tallyReports = function () {
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


function TellonCaseReport(packet, title) {
    this.assertionData = []
    this.title = title
    this.packet = packet
    this.logs = []
}

TellonCaseReport.prototype = Object.create(TellonReport.prototype)

TellonCaseReport.prototype.addLog = function(data) {
    if (Array.isArray(data))
        return this.assertionData = data

    this.logs.push(`\t\t[LOGGER:>>] ${data.data}`)
}

TellonCaseReport.prototype.tally = function() {
    this.pass = this.assertionData[0];
    return this.pass;
}

TellonCaseReport.prototype.print = function() {
    let assertionData = this.assertionData;
    let passFail = this.pass ? "\u2713" : "\u2717"
    let readout = `\n\t${passFail} - ${this.title}\n${this.logs.join("\n")}`

    this.readout = readout;

    if (!this.pass)
        this.printAssertionData(assertionData[1], assertionData[2])

    return `${this.readout}\n`
}

TellonCaseReport.prototype.printAssertionData = function(expected, actual) {
    this.readout += `\n\t\tExpected: ${expected}\n\t\tActual: ${actual}\n`
}




console.log(`
 ____  ____  __    __     __   __ _ 
(_  _)(  __)(  )  (  )   /  \\ (  ( \\
  )(   ) _) / (_/\\/ (_/\\(  O )/    /
 (__) (____)\\____/\\____/ \\__/ \\_)__)
    `)


TestRunner._onCompleteCallbacks.push(() => {
    TellonReporter.parseAllTests();
    TellonReporter.print()
})