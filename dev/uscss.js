require(["parser"], function (Parser) {

    var USCSS = "\
    element.class-name {\n\
      $states: :hover, :active, .small;\n\
      font-family: helvetica, arial, sans-serif;\n\
      display: block;\n\
      text-decoration: none;\n\
      color: [blue, red];\n\
      margin: [0, 0 50px, 0 25px, 10px];\n\
      font-size: [1em, 1em, 1.1em, .8em];\n\
      background: [red, rgba(255,255,255,.5)];\n\
      border: [1px solid red,\n\
               2px solid rgba(255,170,50,.5),\n\
               2px dashed blue,\n\
               5px solid black];\n\
    }"

    var USOUTPUT = new Parser(USCSS)

    console.log(USOUTPUT)
})