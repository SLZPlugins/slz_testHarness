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

class TestRunner {
    static tests = []
    static languages = []
    static _onCompleteCallbacks = []

    constructor() {
        throw new Error('This is a static class')
    }

    static addTest(test) {
        this.tests.push(test)
        TestLogger.addNewLogIndex()
    }

    static initialize() {
        this.tests = [];
        this.logs = [];
        this.languages = [];
        this.stopTests = false;
    }

    static run() {
        this.initialize()
    }

    static runTest(index, test) {
        this.heading = test.title;
        TestLogger.addData(test.type, test.title)
        this.languages[index](test.loadTestData())
    }

    static runAllTests() {
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

    static onComplete() {
        this._onCompleteCallbacks.forEach(a => a())
        this.running = false;
    }


}

class TestLogger {
    static rawData = []
    static timeStamps = []
    static logs = []
    static logIndex = 0;
    
    constructor() {
        throw new Error('This is a static class')
    }

    static addData(...data){
        this.logs[this.logIndex].push(new TestPacket('data', data))
    }

    static log(message){
        this.logs[this.logIndex].push(new TestPacket('log', message))
    }

    static addNewLogIndex(){
        this.logs.push([])
    }

    static getTimeStamp(){
        let dt = new Date()
        return `<<<${dt.getHours()}:${dt.getUTCMinutes()}:${dt.getUTCSeconds()}:${dt.getMilliseconds()}>>> `
    }

    static removeTimeStamp(entry){
        return entry.replace(entry.match(/(<<<)(.*?)(>>>)/)[0], '').trim()
    }

    

    static printLogs(){
        let readout = ""
        let list = this.logs;
        let length = list.length;

        for(let i = 0; i < length; i++){
            readout += `\n${list[i].join(`\n`)}`
        }

        console.log(readout)
    }
}


class TestPacket {
    type
    data
    stamp

    constructor(type, data){
        this.type = type
        this.data = data;
        this.stamp = TestLogger.getTimeStamp()
    }
}
