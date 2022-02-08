class rmAssert {
    'use strict'
    constructor() {
        throw new Error('This is a static class')
    }

    static assertTrue(expression) {
        let result = false;
        //Create Report (should stamp itself with current Test title)
        if (expression === true) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result

    }

    static assertFalse(expression) {
        let result = false;
        //Create Report (should stamp itself with current Test title)
        if (expression === false) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
            
            //Finalize Report
            return result
        }
    }

    static assertEquals(obj1, obj2) {
        let result = false;
        //Create Report
        if (this.areEquivalent(obj1, obj2)) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertNull(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(obj1, null)) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertNotNull(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(obj1, null)) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertString(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(typeof obj1, "string")) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertNumber(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(typeof obj1, "number")) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertObject(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(typeof obj1, "object")) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertBoolean(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(typeof obj1, "boolean")) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertFunction(obj1) {
        let result = false;
        //Create Report
        if (this.areEquivalent(typeof obj1, "function")) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }

    static assertInstance(obj1, obj2) {
        let result = false;
        //Create Report
        if (this.areEquivalent(obj1 instanceof obj2, true)) {
            //Report pass
            result = true
        } else {
            //Finalize Report
            return result
            //Report fail
            result = false
        }
        //Finalize Report
        return result
    }



    /*
        The below methods, unWrapStringOrNumber and areEquivalent are taken, unaltered, from
        https://stackoverflow.com/questions/1068834/object-comparison-in-javascript
        submitted by user 
        https://stackoverflow.com/users/42921/eamon-nerbonne
    */
    static unwrapStringOrNumber(obj) {
        return (obj instanceof Number || obj instanceof String
            ? obj.valueOf()
            : obj);
    }
    static areEquivalent(a, b) {
        a = this.unwrapStringOrNumber(a);
        b = this.unwrapStringOrNumber(b);
        if (a === b) return true; //e.g. a and b both null
        if (a === null || b === null || typeof (a) !== typeof (b)) return false;
        if (a instanceof Date)
            return b instanceof Date && a.valueOf() === b.valueOf();
        if (typeof (a) !== "object")
            return a == b; //for boolean, number, string, xml

        var newA = (a.areEquivalent_Eq_91_2_34 === undefined),
            newB = (b.areEquivalent_Eq_91_2_34 === undefined);
        try {
            if (newA) a.areEquivalent_Eq_91_2_34 = [];
            else if (a.areEquivalent_Eq_91_2_34.some(
                function (other) { return other === b; })) return true;
            if (newB) b.areEquivalent_Eq_91_2_34 = [];
            else if (b.areEquivalent_Eq_91_2_34.some(
                function (other) { return other === a; })) return true;
            a.areEquivalent_Eq_91_2_34.push(b);
            b.areEquivalent_Eq_91_2_34.push(a);

            var tmp = {};
            for (var prop in a)
                if (prop != "areEquivalent_Eq_91_2_34")
                    tmp[prop] = null;
            for (var prop in b)
                if (prop != "areEquivalent_Eq_91_2_34")
                    tmp[prop] = null;

            for (var prop in tmp)
                if (!this.areEquivalent(a[prop], b[prop]))
                    return false;
            return true;
        } finally {
            if (newA) delete a.areEquivalent_Eq_91_2_34;
            if (newB) delete b.areEquivalent_Eq_91_2_34;
        }
    }


}

console.log('****Loading slz_Assertions to rmAssert class****')

window.rmAssert = rmAssert


