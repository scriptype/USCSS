define([], function () {

  function Utils () {
  
    // Remove all spaces in the beginning or end of a string.
    this._antiSpace = function (txt, isEnd) {
      // Variables for deciding which part of the string will be spliced.
      var charIndex = isEnd ? (txt.length -1) : 0,
          sliceParams = isEnd ? [0, -1] : [1, txt.length]
      // If a spaces character found in specified position, recurse.
      if (txt[charIndex] === " ") {
        txt = txt.slice(sliceParams[0], sliceParams[1])
        return this._antiSpace(txt, isEnd)
      }
      // No more spaces, return final string.
      return txt
    }
  
    // Detect if a value has an unclosed paranthesis.
    this._wrapper = function (str) {
      // See if str contains any opening or closing paranthesis.
      var isOpens     = str.match(/\(/g),
          isCloses    = str.match(/\)/g),
          // If so keep the count, else set them to zero.
          openCount   = isOpens ? isOpens.length : 0,
          closeCount  = isCloses ? isCloses.length : 0
      // Will return a positive number if it contains opening but not closing paranthesis & vice versa.
      return openCount - closeCount
    }
    
  }
  
  return new Utils()

})