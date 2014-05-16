var FileSystem  = require("fs"),
    Declaration = require("./../lib/declaration")

var rawBuffer   = new Buffer(FileSystem.readFileSync("./uscss.json")),
    fileOptions = JSON.parse(rawBuffer.toString())

FileSystem.readFile(fileOptions.source, function (err, fd) {
    if (err)
        if (err.code === "ENOENT")
            throw fileOptions.source + " doesn't exist."
        else
            throw err

    var fileData = new Buffer(fd),
        usInput = new Declaration(fileData.toString())

    usInput.getOutput()

    var usOutput = usInput.output

    FileSystem.writeFile(fileOptions.output, usOutput, function (err) {
        if (err)
            throw err
        else
            console.log(fileOptions.output, "created.")
    })
})