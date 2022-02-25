console.log(`
 ____  _  _     __   ____  ____  ____  ____  ____ 
(  _ \\( \\/ )   / _\\ / ___)/ ___)(  __)(  _ \\(_  _)
 )   // \\/ \\  /    \\\\___ \\\\___ \\ ) _)  )   /  )(  
(__\\_)\\_)(_/  \\_/\\_/(____/(____/(____)(__\\_) (__)
    `)
function rmAssert() {
    throw new Error('This is a rmAssert.class')
}

rmAssert.logger = TestLogger

rmAssert.assertTrue = function (expression) {
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

rmAssert.assertFalse = function (expression) {
    let result = false;

    if (expression === false) {
        //Report pass
        result = true
    } else {
        //Report fail
        result = false
    }
    //Finalize Report
    this.logger.addData(result, false, expression)
    return result
}

rmAssert.assertEquals = function (obj1, obj2) {
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

rmAssert.assertNotEquals = function (obj1, obj2) {
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

rmAssert.assertNull = function (obj1) {
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

rmAssert.assertNotNull = function (obj1) {
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

rmAssert.assertString = function (obj1) {
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

rmAssert.assertNumber = function (obj1) {
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

rmAssert.assertObject = function (obj1) {
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

rmAssert.assertBoolean = function (obj1) {
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

rmAssert.assertFunction = function (obj1) {
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

rmAssert.assertInstance = function (obj1, obj2) {
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
