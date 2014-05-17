var Declaration = require("./../lib/declaration")

var Utils = {

    // Remove all spaces in the beginning or end of a string.
    antiSpace: function (txt, isEnd) {
      // Variables for deciding which part of the string will be spliced.
      var charIndex = isEnd ? (txt.length -1) : 0,
          sliceParams = isEnd ? [0, -1] : [1, txt.length]
      // If a spaces character found in specified position, recurse.
      if (txt[charIndex] === "\n" || txt[charIndex] === "\r" || txt[charIndex] === " ") {
        txt = txt.slice(sliceParams[0], sliceParams[1])
        return this.antiSpace(txt, isEnd)
      }
      // No more spaces, return final string.
      return txt
    },

    // Detect if a value has an unclosed paranthesis.
    wrapper: function (str) {
      // See if str contains any opening or closing paranthesis.
      var isOpens     = str.match(/\(/g),
          isCloses    = str.match(/\)/g),
          // If so keep the count, else set them to zero.
          openCount   = isOpens ? isOpens.length : 0,
          closeCount  = isCloses ? isCloses.length : 0
      // Will return a positive number if it contains opening but not closing paranthesis & vice versa.
      return openCount - closeCount
    },

    // Make a list of declarations out of .uscss source file contents
    getDeclarations: function (uscss) {
        // Split declarations by their ending char "}"
        var decs = uscss.split("}")
        // Remove that are nothing but space (often the pseudo-one after last dec, result of splitting)
        decs = decs.filter(function (dec) {
            return dec.replace(/\s/, "").length
        })
        // Get their "}" back if they contain "{" (not a comment at the end of file). Result of splitting.
        decs = decs.map(function (dec) {
            return new Declaration(dec + (dec.match("{") ? "}" : ""))
        })
        // Will return an array of css blocks/declarations.
        return decs
    }

}

module.exports = Utils