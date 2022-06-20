class HUI_TestSelector extends Window_Command {
    
    initialize() {
        super.initialize(0, 0)
        this.setHandler('selectTest', this.selectTest.bind(this))
    }

    makeCommandList() {
        let list = slz_Harness._loadedTests;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            this.addCommand(list[i].title, 'selectTest')
        }
    }

    selectTest() {
        slz_Harness.execute(this._index)
    }


}


class HUI_TestResults  extends Window_Base {
    
}

slz_Harness.registerModule('HUI')