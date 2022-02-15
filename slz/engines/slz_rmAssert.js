let model = {
    name: "rmAssert",
    install: ()=>{
        loadBanner()
    }
}

function loadBanner(){
    console.log(`
 /RRRRRRR /MM      /MM                                      
| RR__  R| MMM    /MMM                                      
| RR  \\ R| MMMM  /MMMM                                      
| RRRRRRR| MM MM/MM MM                                      
| RR__  R| MM  MMM| MM                                      
| RR  \\ R| MM\\  M | MM                                      
| RR  | R| MM \\/  | MM                                      
|__/  |_/AAAAAA   |__/                               /TT    
       /AA__  AA                                    | TT    
      | AA \\ AA /SSSSSSS/SSSSSSS /EEEEEE  /RRRRRR /TTTTTT  
      | AAAAAAAA/SS_____/SS_____//EE__  EE/RR__  R|_  TT_/  
      | AA__  A|  SSSSS|  SSSSSS| EEEEEEE| RR \\__/ | TT    
      | AA  | AA\\___  S\\___    S| EE_____| RR      | TT /TT
      | AA  | AA/SSSSSSS/SSSSSSS|  EEEEEE| RR      | TTTT/
      |__/  |__|_______|_______/\\_______|__/        \\___/
    `)    
}
class rmAssert {
     'use strict'
    static reporter = HarnessReporter;

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
        
        this.reporter.createReport(result, true, expression)
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
            this.reporter.createReport(result, false, expression)
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
        this.reporter.createReport(result, obj1, obj2)
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
        this.reporter.createReport(result, true, result)
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
        this.reporter.createReport(result, null, obj1)
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
        this.reporter.createReport(result, "Not Null", expression)
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
        this.reporter.createReport(result, 'string', typeof obj1)
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
        this.reporter.createReport(result, 'number', typeof obj1)
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
        this.reporter.createReport(result, 'object', typeof obj1)
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
        this.reporter.createReport(result, 'boolean', typeof obj1)
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
        this.reporter.createReport(result, 'function', typeof obj1)
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
        this.reporter.createReport(result, true, false)
        return result
    }
}


let manifest = {
    rmAssert:rmAssert    
}

registerEngine(model, manifest)