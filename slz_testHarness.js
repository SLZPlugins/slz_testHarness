/*:
* @plugindesc SLZ standardplayer-Lanzy JS Test Harness for MV and MZ
* @author slz
* @target MZ
*
 */

var Imported = Imported || {};
Imported.slz = 'slz_TestHarness';

var slz = slz || { params: {} };
slz.testHarness = slz.testHarness || {};


/* ///////////////////////////////////////////////////////////////////////////
        Test Runner  #runner #tr
   /////////////////////////////////////////////////////////////////////////// */

function TestRunner() {
    throw new Error('This is a static class')
}

TestRunner.tests = []
TestRunner.languages = []
TestRunner._onCompleteCallbacks = []
TestRunner.addTest = function (test) {
    this.tests.push(test)
    TestLogger.addNewLogIndex()
}

TestRunner.initialize = function () {
    this.tests = [];
    this.logs = [];
    this.languages = [];
    this.stopTests = false;
}

TestRunner.run = function () {
    this.initialize()
    this.runAllTests()
}

TestRunner.runTest = function (index, test) {
    this.heading = test.title;
    TestLogger.addData(test.type, test.title)
    this.languages[index](test.loadTestData())
}

TestRunner.runAllTests = function () {
    let list = this.tests;
    let length = list.length;

    for (let i = 0; i < length; i++) {
        if (this.stopTests) {
            console.log('TestRunner stopping execution')
            return this.running = false
        }

        this.runTest(i, list[i])
        TestLogger.logIndex++
    }

    this.onComplete()
}

TestRunner.onComplete = function () {
    this._onCompleteCallbacks.forEach(a => a())
    this.running = false;
}


function TestLogger() {
    throw new Error('This is a static class')
}

TestLogger.rawData = []
TestLogger.timeStamps = []
TestLogger.logs = []
TestLogger.logIndex = 0;

TestLogger.addData = function (...data) {
    this.logs[this.logIndex].push(new TestPacket('data', data))
}

TestLogger.log = function (message) {
    this.logs[this.logIndex].push(new TestPacket('log', message))
}

TestLogger.addNewLogIndex = function () {
    this.logs.push([])
}

TestLogger.getTimeStamp = function () {
    let dt = new Date()
    return `<<<${dt.getHours()}:${dt.getUTCMinutes()}:${dt.getUTCSeconds()}:${dt.getMilliseconds()}>>> `
}

TestLogger.removeTimeStamp = function (entry) {
    return entry.replace(entry.match(/(<<<)(.*?)(>>>)/)[0], '').trim()
}



TestLogger.printLogs = function () {
    let readout = ""
    let list = this.logs;
    let length = list.length;

    for (let i = 0; i < length; i++) {
        readout += `\n${list[i].join(`\n`)}`
    }

    console.log(readout)
}


function TestPacket(type, data) {
    this.type = type
    this.data = data;
    this.stamp = TestLogger.getTimeStamp()
}
