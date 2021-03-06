var Utils = require("./Utils")

function Declaration (input) {
    this.input = input
}

Declaration.prototype.getSelector = function (input) {

    // Cut off selector part and assign it to selector.
    var selector = input.split("{")[0]

    selector = Utils.commentsOut(selector)

    // Make sure "selector" doesn't contain spaces in the end or start of it.
    selector = Utils.antiSpace(Utils.antiSpace(selector, true), false)

    // el.class-name inner-el
    return selector
}

Declaration.prototype.getRules = function (input) {
    // Separate the "selector" and "rules" sections.
    var rules = input.split("{")

    // Cut off selector part.
    rules.shift()

    // Make "rules" section a string and cut off ending brace.
    rules = rules.join().split("}")
    rules.pop()

    // Separate each rule.
    rules = rules.join().split(";")

    // Rearrange rules by removing spaces (at beginning) & newlines.
    rules = rules.map(function (rule) {
        return Utils.antiSpace(
            Utils.commentsOut(
                rule.replace(/\n/g, "").replace(/\r/g, "")
            )
        )
    })

    /*  There may be a semicolon in the end of last rule,
        this causes an empty string to be counted as a new rule,
        (splitting by ";" causes this) take it out. */
    if (!rules[rules.length - 1])
        rules.pop()

    /* [ "font-size: [1em, 2em]",
     *  "color : red" ] */
    return rules
}

Declaration.prototype.getRulesObject = function (rules) {
    var rulesObject = {},
        i = 0

    for (i; i < rules.length; i++) {
        // Turn first ":" into "-#$-" and split by it (value can contain ":hover", ":active" so...).
        rules[i] = rules[i].replace(":", "-#$-")
        rules[i] = rules[i].split("-#$-")

        // Make an object out of property-value pairs.
        rulesObject[rules[i][0]] = Utils.antiSpace(rules[i][1])
    }

    /* { font-size: "[1em, 2em]",
     *  color: "red" }*/
    return rulesObject
}

Declaration.prototype.getStates = function (rulesObject) {
    // First rule of fight club is $states.
    var states = rulesObject["$states"].split(",")

    // Remove empty states.
    states = states.filter(function (state) {
        return state.replace(/\s/, "").length
    })

    // An empty placeholder for default state.
    states.unshift("")

    // Remove spaces in state strings ("  :hover" won't be cool).
    states = states.map(function (state) {
        return Utils.antiSpace(Utils.antiSpace(state, true), false).replace(/\$/gi, "")
    })

    // Exclude pseudo-rule $states.
    delete this.rulesObject["$states"]

    // ["", ":hover", ".big"]
    return states
}

Declaration.prototype.getStateRules = function (states) {
    // Loop each state and create stateRules with its rules.
    var i = 0,
        stateRules = []

    for (i; i < states.length; i++) {

        for (var property in this.rulesObject) {
            // Make a list of values for every property in ruleObj.
            var valueSet

            // Split values by "," if they're contained with brackets.
            if (this.rulesObject[property].match(/\[/))
                 valueSet = this.rulesObject[property].split(",")
            else // Don't mess with any single value that may contain commas as well.
                valueSet = [this.rulesObject[property]]

            // Correct values that contain commas. i.e: rgb(0,0,0).
            var j = 0
            for (j; j < valueSet.length; j++) {
                // wrapInfo will keep how many unclosed paranthesis value has.
                var wrapInfo     = Utils.wrapper(valueSet[j]),
                    closerIndex  = j

                // Value has some "unclosed" paranthesis. value may be like: "rgba(255".
                if (wrapInfo > 0) {
                    // Look for any values that contain closing paranthesis after this value.
                    var k = j + 1
                    for (k; k < valueSet.length; k++) {
                        // Number of "unopened" paranthesis.
                        var _wrapInfo = Utils.wrapper(valueSet[k])

                        // Means we found missing closing paranthesis. Keep index of this value.
                        if (_wrapInfo * -1 === wrapInfo) {
                          closerIndex = k
                          break
                        }
                    }
                }

                // Means we found missing closing paranthesis.
                if (closerIndex > j) {
                    // Number of values between values that have opening and closing paranthesis.
                    var diff = closerIndex - j,
                        inc  = 1
                    // Concatenate all values into paranthesis-starter-value
                    for (inc; inc <= diff; inc++) {
                        valueSet[j] += "," + valueSet[j + inc]
                    }
                    // Remove idle values which are no more needed.
                    valueSet.splice(j + 1, diff)
                }

                // Clear space characters in both edges of value string.
                valueSet[j] = Utils.antiSpace(Utils.antiSpace(valueSet[j], true), false)
            }

            // If state has a value or valueSet for property, grab it.
            var stateValue = valueSet[i]
            if (stateValue) {
                // Get rid of braces that surrounds values.
                stateValue = stateValue.replace("[", "").replace("]", "")

                /*  If state value is surrounded by parans,
                    means it has multiple values that are seperated by commas inside
                    i.e: ( url(a.png), url(b.png), url(c.png) ),
                    outer parans are useless yet css-breaker, so get them out. */
                if (stateValue.charAt(0) === "(" && stateValue.charAt(stateValue.length - 1) === ")")
                    stateValue = stateValue.slice(1, stateValue.length - 1)

                // If this is the first rule of state, you've to create an empty object for it.
                if (!stateRules[i])
                    stateRules[i] = {
                        state : states[i],
                        rules : {}
                    }

                // This state has now a rule for this property.
                stateRules[i].rules[property] = stateValue
            }
        }
    }

    /* {
     *  "": {
     *      font-size: "1em",
     *      color: "red"
     *  }
     *  ":hover": {
     *      font-size: "2em"
     *  }
     * */
    return stateRules
}

Declaration.prototype.setOutput = function (stateRules) {
    // Prepare interpreted output
    var output = "",
        i = 0

    for (i; i < stateRules.length; i++) {

        // #element.state {\n
        output += this.selector + stateRules[i].state + " {\n"

        for (var property in stateRules[i].rules) {
            // \t property: value;" for each property
            output += "\t" + property + ": " + stateRules[i].rules[property] + ";\n"
        }

        // }\n
        output += "}\n"
    }

    return output
}

Declaration.prototype.getOutput = function () {

    this.rules = this.getRules(this.input)

    // If declaration doesn't start with $states, return input itself
    if (!this.rules[0] || this.rules[0].charAt(0) !== "$")
        this.output = Utils.antiSpace(this.input) + "\n"
    else {
        this.selector = this.getSelector(this.input)
        this.rulesObject = this.getRulesObject(this.rules)
        this.states = this.getStates(this.rulesObject)
        this.stateRules = this.getStateRules(this.states)
        this.output = this.setOutput(this.stateRules)
    }

}

module.exports = Declaration