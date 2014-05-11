define([
    "utils"
], function (Utils) {

  function Rules (input) {
    this.utils = new Utils()
    this.input = input
    return this.getRules(this.input)
  }

  Rules.prototype.getRules = function (input) {
      console.log("rules set.")
      return input
  }
  
  return Rules

})