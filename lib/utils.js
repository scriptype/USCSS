var Declaration = require("./../lib/declaration")

var Utils = function () {

    // Remove all spaces in the beginning or end of a string.
    this.antiSpace = function (txt, isEnd) {
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
    }

    // Detect if a value has an unclosed paranthesis.
    this.wrapper = function (str) {
      // See if str contains any opening or closing paranthesis.
      var isOpens     = str.match(/\(/g),
          isCloses    = str.match(/\)/g),
          // If so keep the count, else set them to zero.
          openCount   = isOpens ? isOpens.length : 0,
          closeCount  = isCloses ? isCloses.length : 0
      // Will return a positive number if it contains opening but not closing paranthesis & vice versa.
      return openCount - closeCount
    }

    // Detect if any string contains comment.
    this.commentsOut = function (str) {
        // String must fully contain a comment.
        if (str.match(/\/\*/g) && str.match(/\*\//g)) {
            var nStr = str.split("/*")
            nStr[1] = nStr[1].split("*/")[1]
            return nStr.join("")
        }
        return str
    }

    // Make a list of declarations out of .uscss source file contents
    this.getDeclarations = function (uscss) {
        var self = this
        // Split declarations by their ending char "}"
        var decs = uscss.split("}")
        // Remove those which are nothing but space/comment. (both are results of splitting)
        decs = decs.filter(function (dec) {
            return self.commentsOut(dec).replace(/\s/g, "").length
        })
        // Get their "}". Result of splitting.
        decs = decs.map(function (dec) {
            return new Declaration(dec + "}" )
        })
        // Will return an array of css blocks/declarations.
        return decs
    }

}

module.exports = new Utils()