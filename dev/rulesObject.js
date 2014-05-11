define([
    "utils"
], function (Utils) {

  function RulesObject (rules) {
    this.utils = new Utils()
    this.rules = rules
    return this.getRulesObject(this.rules)
  }

  RulesObject.prototype.getRulesObject = function (rules) {
      console.log("rulesObject set.")
      return rules
  }

  return RulesObject

})