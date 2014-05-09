function parse (css) {

  // Define variables.
  var selector = "",
      rules    = [],
      rulesObj = {},
      states   = "",
      output   = ""

  // A utility function: remove all spaces in the beginning or end of a string.
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

  // Seperate the "selector" and "rules" sections.
  rules = css.split("{")
  // Cut off selector part and assign it to selector.
  selector = rules.shift()
  // Make sure "selector" doesn't contain spaces in the end.
  selector = _antiSpace(selector, true)
  
  // Make "rules" section string and cut off ending brace.
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
      // Make a list of values for every property in ruleObj
      var valuesArr = rulesObj[property].split(",")
      var j = 0
      for (j; j < valuesArr.length; j++) {
        // RGBA & RGB values are also listed with ",", so concat them as a single value.
        if (valuesArr[j].match(/rgba/)) {
          // After "rgba(x," there should be 2 more color values and alpha, concat them to "rgba(x,".
          valuesArr[j] += "," + valuesArr[j + 1] + "," + valuesArr[j + 2] + "," + valuesArr[j + 3]
          // Then remove following 3 values.
          valuesArr.splice(j + 1, 3)
        } else if (valuesArr[j].match(/rgb/)) {
          // Same story but without alpha value.
          valuesArr[j] += "," + valuesArr[j + 1] + "," + valuesArr[j + 2]
          valuesArr.splice(j + 1, 2)
        }
        // Clear space characters in both edges of value string.
        valuesArr[j] = _antiSpace(_antiSpace(valuesArr[j], true), false)
      }
      // If state has a value or set of values for property, grab it.
      var stateValue = valuesArr[i]
      if (stateValue) {
        // Get rid of braces that surrounds values.
        stateValue = stateValue.replace("[", "").replace("]", "")
        // If this is the first rule of state, create an empty object for it.
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
      // "  property:value" for each property
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
element {\n\
  $states: :hover, :active, .small;\n\
  display: block;\n\
  text-decoration: none;\n\
  color: [blue, red];\n\
  margin: [0, 0 50px, 0 25px, 10px];\n\
  font-size: [1em, 1em, 1.1em, .8em];\n\
  background: [red, rgba(255,255,255,.5)];\n\
  border: [1px solid red,\n\
           2px solid rgba(255,170,50,.5),\n\
           2px dashed blue,\n\
           5px solid black]\n\
}"

parse(cssdec)