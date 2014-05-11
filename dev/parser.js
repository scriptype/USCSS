define([
  "selector",
  "rules",
  "rulesObject",
  "states",
  "output"
], function (Selector, Rules, RulesObject, States, Output) {

  function Parser (input) {
      this.input        = input
      this.rules        = new Rules(this.input)
      this.selector     = new Selector(this.rules)
      this.rulesObject  = new RulesObject(this.rules)
      this.states       = new States(this.rulesObject)
      this.output       = new Output(this.states)

      return this.output
  }

  return Parser

})

//function parse (css) {

  // Define variables.
//  var selector = "",
//      rules    = [],
//      rulesObj = {},
//      states   = "",
//      output   = ""

  // Seperate the "selector" and "rules" sections.
//  rules = css.split("{")
  // Cut off selector part and assign it to selector.
//  selector = rules.shift()
  // Make sure "selector" doesn't contain spaces in the end.
//  selector = _antiSpace(selector, true)
  
  // Make "rules" section a string and cut off ending brace.
//  rules = rules.join().split("}")
//  rules.pop()
  // Seperate each rule.
//  rules = rules.join().split(";")
  // Rearrange rules by removing spaces (at beginning) & newlines.
//  rules = rules.map(function (rule) {
//    return _antiSpace(rule.replace(/\n/g, ""))
//  })

  // If declaration doesn't start with $states, return itself
//  if (rules[0].charAt(0) !== "$")
//    return css
  
//  /* There may be a semicolon in the end of last rule,
//     this causes an empty string to be counted as a new rule,
//     (splitting by ";" causes this) take it out. */
//  if (!rules[rules.length - 1])
//    rules.pop()

  // Seperate "property" and "value" of each rule.
//  var i = 0
//  for (i; i < rules.length; i++) {
    // Turn first ":" into "-#$-" and split by it (value can contain ":hover", ":active" so...).
//    rules[i] = rules[i].replace(":", "-#$-")
//    rules[i] = rules[i].split("-#$-")
    // Make an object out of property-value pairs.
//    rulesObj[rules[i][0]] = rules[i][1]
//  }

  // First rule of fight club is $states.
//  states = rulesObj.$states.split(",")
  // An empty placeholder for default state
//  states.unshift("")
  // Remove spaces in state strings ("  :hover" won't be cool).
//  states = states.map(function (state) {
//    return state.replace(/\s/g, "")
//  })

  // Exclude pseudo-rule $states.
//  delete rulesObj.$states

  // Loop each state and create stateRules with its rules.
//  var i = 0,
//      stateRules = []
//  for (i; i < states.length; i++) {
//    for (var property in rulesObj) {
      // Make a list of values for every property in ruleObj.
//      var valueSet
      // Split values by "," if they're contained with brackets.
//      if (rulesObj[property].match(/\[/))
//        valueSet = rulesObj[property].split(",")
      // Don't mess with any single value that may contain commas as well.
//      else
//        valueSet = [rulesObj[property]]
      
      // Correct values that contain commas. i.e: rgb(0,0,0).
//      var j = 0
//      for (j; j < valueSet.length; j++) {
        // wrapInfo will keep how many unclosed paranthesis value has.
//        var wrapInfo     = _wrapper(valueSet[j])
//            closerIndex  = j
        // Value has some "unclosed" paranthesis. value may be like: "rgba(255".
//        if (wrapInfo > 0) {
          // Look for any values that contain closing paranthesis after this value.
//          var k = j + 1
//          for (k; k < valueSet.length; k++) {
            // Number of "unopened" paranthesis.
//            var _wrapInfo = _wrapper(valueSet[k])
            // Means we found missing closing paranthesis. Keep index of this value.
//            if (_wrapInfo * -1 === wrapInfo) {
//              closerIndex = k
//              break
//            }
//          }
//        }
        // Means we found missing closing paranthesis.
//        if (closerIndex > j) {
          // Number of values between values that have opening and closing paranthesis.
//          var diff = closerIndex - j,
//              inc  = 1
          // Concatenate all values into paranthesis-starter-value
//          for (inc; inc <= diff; inc++) {
//            valueSet[j] += "," + valueSet[j + inc]
//          }
          // Remove idle values which are no more needed.
//          valueSet.splice(j + 1, diff)
//        }
        // Clear space characters in both edges of value string.
//        valueSet[j] = _antiSpace(_antiSpace(valueSet[j], true), false)
//      }
      
      // If state has a value or valueSet for property, grab it.
//      var stateValue = valueSet[i]
//      if (stateValue) {
        // Get rid of braces that surrounds values.
//        stateValue = stateValue.replace("[", "").replace("]", "")
        // If this is the first rule of state, you've to create an empty object for it.
//        if (!stateRules[i])
//          stateRules[i] = {
//            state : states[i],
//            rules : {}
//          }
        // This state has now a rule for this property.
//        stateRules[i].rules[property] = stateValue
//      }
//    }
//  }

  // Prepare interpreted output
//  var i = 0
//  for (i; i < stateRules.length; i++) {
    // #element.state {
//    output += selector + stateRules[i].state + " {\n"
//    for (var property in stateRules[i].rules) {
      // "  property: value;" for each property
//      output += "\t" + property + ": " + stateRules[i].rules[property] + ";\n"
//    }
    // }
//    output += "}\n"
//  }
  
//  console.log("USCSS:")
//  console.log(css)
//  console.log("----------")
//  console.log("OUTPUT:")
//  console.log(output)
//  console.log("----------")
//  console.log({
//    selector: selector,
//    rules: rules,
//    rulesObj: rulesObj,
//    states: states,
//    stateRules: stateRules
//  })

//  return output
//}