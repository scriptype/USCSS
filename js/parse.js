function parse (css) {

  // Define variables.
  var selector = "",
      rules    = [],
      rulesObj = {},
      states   = "",
      output   = ""

  // Utility function: remove all spaces in the beginning or end of a string.
  function _antiSpace (txt, isEnd) {
    // Variables for deciding which part of the string will be spliced.
    var charIndex = isEnd ? (txt.length -1) : 0,
        sliceParams = isEnd ? [0, -1] : [1, txt.length]
    // If a spaces character found in specified position, recurse.
    if (txt[charIndex] === " ") {
      txt = txt.slice(sliceParams[0], sliceParams[1])
      return _antiSpace(txt, isEnd)
    }
    // No more spaces, return final string.
    return txt
  }
  
  // Utility function: detect if a value has an unclosed paranthesis.
  function _wrapper (str) {
    // See if str contains any opening or closing paranthesis.
    var isOpens     = str.match(/\(/g),
        isCloses    = str.match(/\)/g),
        // If so keep the count, else set them to zero.
        openCount   = isOpens ? isOpens.length : 0,
        closeCount  = isCloses ? isCloses.length : 0
    // Will return a positive number if it contains opening but not closing paranthesis & vice versa.
    return openCount - closeCount
  }

  // Seperate the "selector" and "rules" sections.
  rules = css.split("{")
  // Cut off selector part and assign it to selector.
  selector = rules.shift()
  // Make sure "selector" doesn't contain spaces in the end.
  selector = _antiSpace(selector, true)
  
  // Make "rules" section a string and cut off ending brace.
  rules = rules.join().split("}")
  rules.pop()
  // Seperate each rule.
  rules = rules.join().split(";")
  // Rearrange rules by removing spaces (at beginning) & newlines.
  rules = rules.map(function (rule) {
    return _antiSpace(rule.replace(/\n/g, ""))
  })

  // If declaration doesn't start with $states, return itself
  if (rules[0].charAt(0) !== "$")
    return css
  
  /* There may be a semicolon in the end of last rule,
     this causes an empty string to be counted as a new rule,
     (splitting by ";" causes this) take it out. */
  if (!rules[rules.length - 1])
    rules.pop()

  // Seperate "property" and "value" of each rule.
  var i = 0
  for (i; i < rules.length; i++) {
    // Turn first ":" into "-#$-" and split by it (value can contain ":hover", ":active" so...).
    rules[i] = rules[i].replace(":", "-#$-")
    rules[i] = rules[i].split("-#$-")
    // Make an object out of property-value pairs.
    rulesObj[rules[i][0]] = rules[i][1]
  }

  // First rule of fight club is $states.
  states = rulesObj.$states.split(",")
  // An empty placeholder for default state
  states.unshift("")
  // Remove spaces in state strings ("  :hover" won't be cool).
  states = states.map(function (state) {
    return state.replace(/\s/g, "")
  })

  // Exclude pseudo-rule $states.
  delete rulesObj.$states

  // Loop each state and create stateRules with its rules.
  var i = 0,
      stateRules = []
  for (i; i < states.length; i++) {
    for (var property in rulesObj) {
      // Make a list of values for every property in ruleObj.
      var valueSet
      // Split values by "," if they're contained with brackets.
      if (rulesObj[property].match(/\[/))
        valueSet = rulesObj[property].split(",")
      // Don't mess with any single value that may contain commas as well.
      else
        valueSet = [rulesObj[property]]
      
      // Correct values that contain commas. i.e: rgb(0,0,0).
      var j = 0
      for (j; j < valueSet.length; j++) {
        // wrapInfo will keep how many unclosed paranthesis value has.
        var wrapInfo     = _wrapper(valueSet[j])
            closerIndex  = j
        // Value has some "unclosed" paranthesis. value may be like: "rgba(255".
        if (wrapInfo > 0) {
          // Look for any values that contain closing paranthesis after this value.
          var k = j + 1
          for (k; k < valueSet.length; k++) {
            // Number of "unopened" paranthesis.
            var _wrapInfo = _wrapper(valueSet[k])
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
        valueSet[j] = _antiSpace(_antiSpace(valueSet[j], true), false)
      }
      
      // If state has a value or valueSet for property, grab it.
      var stateValue = valueSet[i]
      if (stateValue) {
        // Get rid of braces that surrounds values.
        stateValue = stateValue.replace("[", "").replace("]", "")
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

  // Prepare interpreted output
  var i = 0
  for (i; i < stateRules.length; i++) {
    // #element.state {
    output += selector + stateRules[i].state + " {\n"
    for (var property in stateRules[i].rules) {
      // "  property: value;" for each property
      output += "\t" + property + ": " + stateRules[i].rules[property] + ";\n"
    }
    // }
    output += "}\n"
  }
  
  console.log("USCSS:")
  console.log(css)
  console.log("----------")
  console.log("OUTPUT:")
  console.log(output)
  console.log("----------")
  console.log({
    selector: selector,
    rules: rules,
    rulesObj: rulesObj,
    states: states,
    stateRules: stateRules
  })

  return output
}

var cssdec = "\
element.class-name {\n\
  $states: :hover, :active, .small;\n\
  font-family: helvetica, arial, sans-serif;\n\
  display: block;\n\
  text-decoration: none;\n\
  color: [blue, red];\n\
  margin: [0, 0 50px, 0 25px, 10px];\n\
  font-size: [1em, 1em, 1.1em, .8em];\n\
  background: [red, rgba(255,255,255,.5)];\n\
  border: [1px solid red,\n\
           2px solid rgba(255,170,50,.5),\n\
           2px dashed blue,\n\
           5px solid black];\n\
}"

parse(cssdec)