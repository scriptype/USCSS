define([
    "utils"
], function (Utils) {

  function States (rulesObject) {
    this.utils = new Utils()
    this.rulesObject = rulesObject
    return this.getStates(this.rulesObject)
  }

  States.prototype.getStates = function (rulesObject) {
      console.log("states set.")
      return rulesObject
  }
  
  return States

})