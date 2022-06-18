/*
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
    
*/

class rmAssert {
    constructor() {
        throw new Error('This is a static class')
    }
}

rmAssert.initialize = function(){
    this.setStandardProps()
}

rmAssert.setStandardProps = function(){
    this.logger = slz_Harness.logger
}

rmAssert.assertTrue = function(expression) {
    this.logger.addAssertion('rmAssert', expression, true, expression)
    return expression;
}

rmAssert.assertFalse = function(expression) {
    this.logger.addAssertion('rmAssert', !expression, false, expression)
    return !expression;
}

rmAssert.assertEquals = function(obj1, obj2) {
    let result = standardPlayer.sp_Core.areEquivalent(obj1, obj2);
    this.logger.addAssertion('rmAssert', result, obj1, obj2)
    return result
}

rmAssert.assertNotEquals = function(obj1, obj2){
    let result = !standardPlayer.sp_Core.areEquivalent(obj1, obj2);
    this.logger.addAssertion('rmAssert', result, true, result)
    return result
}

rmAssert.assertNull = function(obj1) {
    let result = standardPlayer.sp_Core.areEquivalent(obj1, null);
    this.logger.addAssertion('rmAssert', result, null, obj1)
    return result
}

rmAssert.assertNotNull = function(obj1) {
    let result = !standardPlayer.sp_Core.areEquivalent(obj1, null);
    this.logger.addAssertion('rmAssert', result, "Not Null", obj1)
    return result
}

rmAssert.assertString = function(obj1) {
    let result = standardPlayer.sp_Core.areEquivalent(typeof obj1, "string");
    this.logger.addAssertion('rmAssert', result, 'string', typeof obj1)
    return result
}

rmAssert.assertNumber = function(obj1) {
    let result = standardPlayer.sp_Core.areEquivalent(typeof obj1, "number");
    this.logger.addAssertion('rmAssert', result, 'number', typeof obj1)
    return result
}

rmAssert.assertObject = function(obj1) {
    let result = standardPlayer.sp_Core.areEquivalent(typeof obj1, "object");
    this.logger.addAssertion('rmAssert', result, 'object', typeof obj1)
    return result
}

rmAssert.assertBoolean = function(obj1) {
    let result = standardPlayer.sp_Core.areEquivalent(typeof obj1, "boolean");
    this.logger.addAssertion('rmAssert', result, 'boolean', typeof obj1)
    return result
}

rmAssert.assertFunction = function(obj1) {
    let result = standardPlayer.sp_Core.areEquivalent(typeof obj1, "function");
    this.logger.addAssertion('rmAssert', result, 'function', typeof obj1)
    return result
}

rmAssert.assertInstance = function(obj1, obj2) {
    let result = standardPlayer.sp_Core.areEquivalent(obj1 instanceof obj2, true);
    this.logger.addAssertion('rmAssert', result, true, false)
    return result
}

rmAssert.initialize()
slz_Harness.registerModule('rmAssert') //When registering, pass rmAssert to the register function, and it will run the initialize function on rmAssert