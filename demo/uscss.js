var FileSystem  = require("fs"),
    Utils = require("./../lib/utils")

// Get contents of uscss.json
var options     = JSON.parse(
    (new Buffer(
        FileSystem.readFileSync("./uscss.json")
    )).toString())

// Read contents of source file that is stated in uscss.json
FileSystem.readFile(options.source, function (err, fd) {
    if (err)
        if (err.code === "ENOENT")
            throw err.path + " doesn't exist."
        else
            throw err

    // Get the list of separate css-blocks
    var declarations = Utils.getDeclarations(new Buffer(fd).toString()),
        usOutput = "/* compiled with USCSS on: " + new Date() + "*/ \n",
        i = 0
    for (i; i < declarations.length; i++) {
        // Get each declaration block prepare their output
        declarations[i].getOutput()
        // Append outputs each other
        usOutput += declarations[i].output
    }

    // Write output into the output file that is stated in uscss.json
    FileSystem.writeFile(options.output, usOutput, function (err) {
        if (err)
            throw err
        else
            console.log(options.output, "created.")
    })
})