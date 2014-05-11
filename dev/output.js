define([
    "utils"
], function (Utils) {

  function Output (states) {
    this.utils = new Utils()
    this.states = states
    return this.getOutput(this.states)
  }

  Output.prototype.getOutput = function (states) {
      console.log("output set.")
      return states
  }
  
  return Output

})