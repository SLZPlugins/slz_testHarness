sinot.createTest("Phobos Turn Order Manager Test", () => {
    
    //can scope varibles to entire test instace
    let testLevelVar = 'Running Before All';
    return [
        // beforeAll(()=>{
        //     console.log('This will run once, before the first scenario runs')
        // }),
        // beforeEachScenario(()=>{
        //     console.log('This will run before each test scenario runs')
        // }),
        // afterEachScenario(()=>{
        //     console.log('This will run before each test scenario runs')
        // }),
        sinot.scenario("Update turn order", () => {
            //can scope varibles to individual scenario
            let tm = TurnOrderManager;

            return [
                slz_Harness.addBeforeAllTestHook(()=>{
                    /*
                        Note: These tests only work when there are at least 4 battlers available and
                        turnOrderLength is set to 5. 
                    */
                             
                }),

                slz_Harness.addAfterTestHook(()=>{

                }),

                sinot.testCase("Set the length of the turn order list to 3 battlers", () => {
                    let turnOrderLength = 3;
                    tm.setTurnOrderLength(turnOrderLength);
                    tm.updateTurnOrder();
                    let battleMembers = tm.getSortedBattleMembers();
                    let firstBattler = battleMembers[0];
                    let secondBattler = battleMembers[1];
                    let thirdBattler = battleMembers[2];
                    let fourthBattler = battleMembers[3];
                    let currentRound = tm.getCurrentRound().getBattlers();
                    
                    rmAssert.assertTrue(currentRound.contains(firstBattler));
                    rmAssert.assertTrue(currentRound.contains(secondBattler));
                    rmAssert.assertTrue(currentRound.contains(thirdBattler));
                    rmAssert.assertFalse(currentRound.contains(fourthBattler));
                    rmAssert.assertEquals(turnOrderLength, tm.countAllBattlersInTurnOrder());

                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),

                sinot.testCase("Set the length of the turn order list to 10 battlers", () => {
                    let turnOrderLength = 10;
                    tm.setTurnOrderLength(turnOrderLength);
                    tm.updateTurnOrder();

                    rmAssert.assertEquals(turnOrderLength, tm.countAllBattlersInTurnOrder());
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                                
                sinot.testCase("Second in turn should be in front when first is finished", () => {
                    tm.updateTurnOrder();
                    let battleMembers = tm.getTurnOrder()[0].getBattlers();
                    let firstBattler = battleMembers[0];
                    let secondBattler = battleMembers[1];
                    firstBattler.setActionState("finished");
                    tm.updateTurnOrder();

                    let turnOrder = tm.getTurnOrder()[0].getBattlers();
                    
                    rmAssert.assertEquals(secondBattler.name(), turnOrder[0].name());
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                
                sinot.testCase("Turn order length should remain 20 when finished battler removed", () => {
                    tm.setTurnOrderLength(20);
                    tm.updateTurnOrder();
                    tm.forceNextTurn();
                    
                    rmAssert.assertEquals(20, tm.countAllBattlersInTurnOrder());
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                
                sinot.testCase("When actor is dead skip", () => {
                    tm.updateTurnOrder();
                    let battleMembers = tm.getBattlersFromCurrentRound();
                    let firstBattler = battleMembers[0];
                    let secondBattler = battleMembers[1];
                    firstBattler.addState(1); //adding death state
                    tm.updateTurnOrder();
                    
                    rmAssert.assertTrue(tm.getTurnOrder()[0].getBattlers()[0] == secondBattler);
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                
                sinot.testCase("When 2 actors are dead skip to third in turn", () => {
                    tm.updateTurnOrder();
                    let battleMembers = tm.getBattlersFromCurrentRound();
                    let firstBattler = battleMembers[0];
                    let secondBattler = battleMembers[1];
                    let thirdBattler = battleMembers[2];
                    firstBattler.addState(1); //adding death state
                    secondBattler.addState(1); //adding death state
                    tm.updateTurnOrder();
                    
                    rmAssert.assertTrue(tm.getTurnOrder()[0].getBattlers()[0] == thirdBattler);
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                
                sinot.testCase("On force next turn removes first battler and second becomes first", () => {
                    tm.updateTurnOrder();
                    let secondBattler = tm.getBattlersFromCurrentRound()[1];
                    tm.forceNextTurn();
                    tm.updateTurnOrder();
                    
                    rmAssert.assertTrue(tm.getBattlersFromCurrentRound()[0] == secondBattler);
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                
                sinot.testCase("When Game_Round has no battlers left tm removes it from turn order", () => {
                    tm.updateTurnOrder();
                    let currentRound = tm.getCurrentRound();
                    currentRound.clearBattlers();
                    tm.updateTurnOrder();
                    //tm.getTurnOrder().forEach(t => console.log("Round ID: " + t.getId()));
                    
                    rmAssert.assertTrue(tm.getCurrentRound().getId() == 2);
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
                
                sinot.testCase("When actors are dead or finished go to next turn", () => {
                    tm.updateTurnOrder();
                    let firstRound = tm.getCurrentRound();
                    let secondRound = tm.getTurnOrder()[1];
                    let battleMembers = firstRound.getBattlers();
                    battleMembers.forEach(b => b.setActionState("finished"));
                    tm.updateTurnOrder();
                    
                    rmAssert.assertTrue(tm.getTurnOrder()[0].getId() === secondRound.getId());
                    
                    tm.resetTurnOrder();
                    $gameParty.members().forEach(member => member.setActionState(""));
                    $gameParty.members().forEach(member => member.clearStates());
                }),
            ]
        }), 

        sinot.scenario("Testing Game_Round class", () => {
            //can scope variables to individual scenario
            let tm = TurnOrderManager;
            let battlers = [
                $gameParty.members()[0],
                $gameParty.members()[1],
                $gameParty.members()[2],
                $gameParty.members()[3]
            ];
            
            return [
                slz_Harness.addBeforeTestHook (()=>{
                    battlers.forEach(b => b.setActionState(""));  
                }),

                slz_Harness.addAfterTestHook(()=>{
                    tm._turnOrder = [];
                    tm._turnOrderLength = 5;
                }),

                sinot.testCase("The fastest battler should be first in list", () => {
                    battlers.forEach(b => b.setActionState(""));  

                    let round1 = new Game_Round(1, battlers);
                    let fastestBattlerSpeed = Math.max.apply(null, round1.getBattlers().map(b => b.speed()));
                    round1.update();

                    rmAssert.assertEquals(fastestBattlerSpeed, round1.getBattlers()[0].speed());

                    tm._turnOrder = [];
                    tm._turnOrderLength = 5;
                }),

                sinot.testCase("Finished Battler should be removed", () => {
                    battlers.forEach(b => b.setActionState(""));  
                    
                    let finishedBattler = battlers[2].setActionState("finished");
                    let round1 = new Game_Round(1, battlers);
                    round1.update();
                    
                    rmAssert.assertNotEquals(battlers.contains(finishedBattler));
                    
                    tm._turnOrder = [];
                    tm._turnOrderLength = 5;
                }),

                sinot.testCase("Remove last battler", () => {
                    battlers.forEach(b => b.setActionState(""));  
                    
                    let round1 = new Game_Round(1, battlers);
                    let lastBattler = battlers[battlers.length - 1];
                    round1.update();
                    round1.removeLastBattler();
                    
                    rmAssert.assertFalse(battlers.contains(lastBattler));
                    
                    tm._turnOrder = [];
                    tm._turnOrderLength = 5;
                }),

                sinot.testCase("Remove first battler", () => {
                    battlers.forEach(b => b.setActionState(""));  
                    
                    let round1 = new Game_Round(1, battlers);
                    let firstBattler = battlers[0];
                    round1.update();
                    round1.forceRemoveFirstBattler();
                    
                    rmAssert.assertFalse(battlers.contains(firstBattler));
                    
                    tm._turnOrder = [];
                    tm._turnOrderLength = 5;
                }),
            ]
        })
    ]
})
