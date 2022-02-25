# slz_sandbox 
### Engine File: slz_sandbox.js
### Param Name: slz_sandbox

## Overview
The purpose of this plugin is to provide standalone sandbox, spy and stub
functionality for testing with slz_testHarness.js

## Sandboxes
In testing, a sandbox is a settable and resettable environment to assist in 
executing different tests under similar conditions. Currently, the primary 
feature of this sandbox is to provide the ability to spy on or stub objects
and functions, while easily resetting them between tests or scenarios. 

## Spies
If you aren't familiar with spies, they're a lot like what their name suggests. 
Think of it like a nosy neighbor. They don't know what goes on in your house
(hopefully!) but they know as much as they can by observing you. Peeking through
their blinds, commenting about when you take your dog out, or leave for work. 

Spies in slz_sandbox wrap around a function, and allow it to continue behaving
as it normally would. The difference is, now the spy knows how many times the 
function was called, and what arguments it was called with each time. 

This can be useful information for validating, as sometimes there isn't an 
assertion that fits best on it's own for a test. Sometimes you need to confirm
that a function was called, or called with the correct arguments. If a function
isn't firing off when it's supposed to, it can be hard to tell when writing and 
testing code. However with unit testing and spies, it's much easier to validate
when an where a problem is occuring, and also prove that your functional flow
is proceeding as planned. 

## Stubs
A stub is sometimes mistakenly called a __mock__. And sometimes...it's not 
mistakenly called a mock... it actually depends on the language, and who you're
asking. In slz_sandbox, a stub is __an independent copy of an instance object__,
with properties identical to it's source and 'mocked' methods

If you stub out $gamePlayer, you get an object that is a 'clone' of $gamePlayer. 
To start with, if $gamePlayer currently has x:10, so will your stub. 
However, your stub's .moveByInput method doesn't do anything. It's a working
method, but it starts off as an empty function with no return value.

An important note here is that the mocked object, $gamePlayer, is not altered in
any way. But now you have an object with a matching state, that you can manipulate
and test without fear of breaking the game. If you need one of it's methods to
run for your test, you can actually 'mock' that function. 

### Creating a sandbox, spy and stub
    
    let sandbox = new slz_sandbox()
    let mySpy = sandbox.spy($gameMap, "event")
    let myStub = sandbox.stub($gamePlayer)
    let obj = myStub.stub
    
    
### Confirming a spy was called
The following methods are avaiable on spies    
* called()
* calledAtLeastNTimes(num)
* calledAtLeastNTimesWith(num, ...args)
* calledExactlyNTimes(num)
* calledExactlyNTimesWith(num, ...args)

These will return true or false, and validate as their names suggest.

    let sandbox = new slz_sandbox()
    let mySpy = sandbox.spy($gameMap, "event")
    
    $gameMap.event(1)
    $gameMap.event()
    
    mySpy.called() //true
    mySpy.calledAtLeastNTimes(1) //true
    mySpy.calledAtLeastNTimesWith(2, 1) //false
    mySpy.calledExactlyNTimes(2) //true
    mySpy.calledExactlyNTimesWith(1, 1) //true


### Mocking a stubbed function

    let sandbox = new slz_sandbox()
    let myStub = sandbox.stub($gamePlayer)
    let obj = myStub.stub
    
    obj.setDirection(2) // Doesn't do anything
    
    myStub.on('setDirection') //When calling this function
        .with(2) //With these specific args
        .then(function(){this._direction = 2}) //run this function
        
    obj.setDirection(2) //Will change obj._direction to 2
    

### Mocking a stubbed function with no arguments

let sandbox = new slz_sandbox()
let myStub = sandbox.stub($gamePlayer)
    let obj = myStub.stub
    
    obj.characterName() // Doesn't do anything
    
    myStub.on('characterName') //When calling this function
        .then(function(){return "Ralph"}) //run this function
        
    obj.characterName() //Will return Ralph
    
    

## Resetting your environment
To reset a spy or a stub individually, call reset on that spy or stub and it
will return to the state it had when it was initially created. 

The sandbox tracks all spies and stubs, and all created spies and stubs can 
be reset at once by calling reset on the sandbox


    mySpy.reset() //reset a spy
    myStub.reset() //reset a stub
    sandbox.reset() //reset all spies and stubs created by this sandbox


## Why Stubs?
There are various reasons to use stubs, one of the most common hang ups is that
it seems like you're doing extra work to manually define functions since they
get replaced. The fact is, you only define functions you need, if and when you 
need them. 

One of the best reasons to use stubs is to quickly mock an object that isn't
the point of a test you're writing, but needs to be there. For example, if 
you're testing transfering contents from the player's inventory, and you're
only concerned with the player side of things, not validating the location
they're transferring inventory to, it could be cumbersome to set up a valid
location just to test the player transferring something.

In that case, a stub allows you to have a valid object that looks and feels like
the location, and can let your test believe there is really a valid object there. 
If that stub is expected to call a function, it's usually enough just that
a stubbed function exists. You aren't testing the stub, so you can freely 
worry about your player's inventory tests.

