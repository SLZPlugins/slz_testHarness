    console.log(`
 ____  _  _     __   ____  ____  ____  ____  ____ 
(  _ \\( \\/ )   / _\\ / ___)/ ___)(  __)(  _ \\(_  _)
 )   // \\/ \\  /    \\\\___ \\\\___ \\ ) _)  )   /  )(  
(__\\_)\\_)(_/  \\_/\\_/(____/(____/(____)(__\\_) (__)
    `)    
class rmAssert {
     'use strict'
    static logger = TestLogger

    constructor() {
        throw new Error('This is a static class')
    }

    static assertTrue(expression) {
        let result = false;

        if (expression === true) {
            result = true
        } else {
            result = false
        }
        //Finalize Report
        
        this.logger.addData(result, true, expression)
        return result

    }

    static assertFalse(expression) {
        let result = false;

        if (expression === false) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
            
            //Finalize Report
            this.logger.addData(result, false, expression)
            return result
        }
    }

    static assertEquals(obj1, obj2) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(obj1, obj2)) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, obj1, obj2)
        return result
    }

    static assertNotEquals(obj1, obj2){
        let result = false;

        if (!standardPlayer.sp_Core.areEquivalent(obj1, obj2)) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, true, result)
        return result
    }

    static assertNull(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(obj1, null)) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, null, obj1)
        return result
    }

    static assertNotNull(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(obj1, null)) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, "Not Null", expression)
        return result
    }

    static assertString(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(typeof obj1, "string")) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, 'string', typeof obj1)
        return result
    }

    static assertNumber(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(typeof obj1, "number")) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, 'number', typeof obj1)
        return result
    }

    static assertObject(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(typeof obj1, "object")) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, 'object', typeof obj1)
        return result
    }

    static assertBoolean(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(typeof obj1, "boolean")) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, 'boolean', typeof obj1)
        return result
    }

    static assertFunction(obj1) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(typeof obj1, "function")) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, 'function', typeof obj1)
        return result
    }

    static assertInstance(obj1, obj2) {
        let result = false;

        if (standardPlayer.sp_Core.areEquivalent(obj1 instanceof obj2, true)) {
            //Report pass
            result = true
        } else {
            //Report fail
            result = false
        }
        //Finalize Report
        this.logger.addData(result, true, false)
        return result
    }
}