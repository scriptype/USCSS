function parse (css) {
  var selector = "",
      rules    = css.split("{\n"),
      rulesObj = {},
      states   = "",
      output   = ""

  function antiSpace (txt, end) {
    var charIndex = end ? (txt.length -1) : 0,
        sliceParams = end ? [0, -1] : [1, txt.length]
    if (txt[charIndex] === " ") {
      txt = txt.slice(sliceParams[0], sliceParams[1])
      return antiSpace(txt, end)
    }
    return txt
  }
  
  selector = rules.shift()
  selector = antiSpace(selector, true)

  rules = rules.join().split("\n}")
  rules.pop()
  rules = rules.join().split("\n")
  rules = rules.map(function (rule) {
    return antiSpace(rule).replace(/;/g, "")
  })

  if (rules[0].charAt(0) !== "$")
    return css

  var i = 0
  for (i; i < rules.length; i++) {
    rules[i] = rules[i].replace(":", "-#$-")
    rules[i] = rules[i].split("-#$-")
    rulesObj[rules[i][0]] = rules[i][1]
  }

  states = rulesObj.$states.split(",")
  states.unshift("")
  states = states.map(function (state) {
    return state.replace(/\s/g, "")
  })

  delete rulesObj.$states

  var i = 0,
      stateRules = []
  for (i; i < states.length; i++) {
    for (var property in rulesObj) {
      var stateValue = rulesObj[property].split(",")[i]
      if (stateValue) {
        stateValue = stateValue.replace("[", "")
        stateValue = stateValue.replace("]", "")
        if (!stateRules[i])
          stateRules[i] = {
            state : states[i],
            rules : {}
          }
        stateRules[i].rules[property] = stateValue
      }
    }
  }

  var i = 0
  for (i; i < stateRules.length; i++) {
    output += selector + stateRules[i].state + " {\n"
    for (var rule in stateRules[i].rules) {
      output += "\t" + rule + ":" + stateRules[i].rules[rule] + ";\n"
    }
    output += "}\n"
  }
  
  console.log("USCSS:")
  console.log(css)
  console.log("----------")
  console.log("OUTPUT:")
  console.log(output)

  return output
}

var cssdec = "\
element {\n\
  $states: :hover, :active, .small;\n\
  color: [blue, red];\n\
  margin: [0, 0 50px, 0 25px, 10px];\n\
  font-size: [1em, 1em, .8em]\n\
}"

parse(cssdec)