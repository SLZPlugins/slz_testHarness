# slz_Assertions (rmAssert)
### Engine File: slz_Assertions.js
### Param Name: rmAssert

## Overview
The purpose of this engine is to provide the default engine for 
slz_testHarness.js

It provides a basic assertion library that allows the following assertions:
* assertTrue(x)
* assertFalse(x)
* assertEquals(x, y)
* assertNotEquals(x, y)
* assertNull(x)
* assertNotNull(x)
* assertString(x)
* assertNumber(x)
* assertObject(x)
* assertBoolean(x)
* assertFunction(x)
* assertInstance(object, targetClass) //Assert object is instance of targetClass

Some of these could be considered superfluous and may be removed later, but they
were chosen to make tests more readable. assertArray isn't a function here
for example, because Array.isArray() is highly readable as is. It could also be
said that varA instanceof classB is clear, too, however it could also be said
that decreases readabililty, because the syntax is very different than most 
other comparison operations in JS. 

Either way, this library provides a simple but robust set of assertion tools, 
all of which provide reporting to the slz_Reporter object on slz_testHarness.

It is also a useful template for how to implement reporting into custom engines
to run in the harness.

