define([
    "utils"
], function (Utils) {

  function Selector (rules) {
    this.utils = new Utils()
    this.rules = rules
    return this.getSelector(this.rules)
  }

  Selector.prototype.getSelector = function (rules) {
      console.log("selector set.")
      return rules
  }
  
  return Selector

})