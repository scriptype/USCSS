var FileSystem  = require("fs"),
    Utils       = require("../lib/utils")

var source      = (new Buffer(FileSystem.readFileSync("./demo/style.uscss"))).toString(),
    declarations = Utils.getDeclarations(source)

/* BUGINDEX
 * TODO #1: fix comments, https://github.com/scriptype/USCSS/issues/1 */

describe("Declaration class", function () {

//    beforeEach()

    var i = 0
    for (i; i < declarations.length; i++) {
        declarations[i].getOutput()
    }

    it("should pass declarations without a $state property", function () {
        expect(typeof declarations[2].rulesObject).toBe("undefined")
        expect(typeof declarations[3].rulesObject).toBe("undefined")
    })

    it("should get SELECTOR of a uscss declaration properly", function () {
        expect(declarations[0].selector).toBe("div.muz")
        expect(declarations[1].selector).toBe("a") // TODO #1

        expect(declarations[4].selector).toBe("p") // TODO #1
        expect(declarations[5].selector).toBe("hr")
    })

    it("should get RULES-OBJECT of a uscss declaration properly", function () {

        expect(declarations[0].rulesObject["font-family"]).toBe("helvetica, arial, sans-serif")
        expect(declarations[0].rulesObject["display"]).toBe("block")
        expect(declarations[0].rulesObject["text-decoration"]).toBe("none")
        expect(declarations[0].rulesObject["color"]).toBe("[blue, red]")
        expect(declarations[0].rulesObject["margin"]).toBe("[0, 0 50px, 0 25px, 10px]")
        expect(declarations[0].rulesObject["background"]).toBe("[red, rgba(255,255,255,.5)]")
        expect(declarations[0].rulesObject["border"].replace(/\s/g, "")).toBe("[1pxsolidred,2pxsolidrgba(255,170,50,.5),2pxdashedblue,5pxsolidblack]")

        expect(declarations[1].rulesObject["font-family"]).toBe("helvetica, arial, sans-serif") // TODO #1
        expect(declarations[1].rulesObject["display"]).toBe("[block, none, block]")
        expect(declarations[1].rulesObject["color"]).toBe("[#eee, #ddd, red]") // TODO #1
        expect(declarations[1].rulesObject["text-decoration"]).toBe("none")
        expect(declarations[1].rulesObject["background"].replace(/\s/g, "")).toBe("[(url(..img/leyley.png)topleft,url(../img/lel.png)bottomcenter),url(../img/lol.png),#fd5]")

        expect(declarations[4].rulesObject["color"]).toBe("red") // TODO #1
        expect(declarations[4].rulesObject["background"]).toBe("[blue, red]")

        expect(declarations[5].rulesObject["color"]).toBe("red")
        expect(declarations[5].rulesObject["background"]).toBe("[blue, red]")
    })

    it("should delete pseudo-property $state from output", function () {
        expect(declarations[0].rulesObject["$states"]).toBeUndefined()
        expect(declarations[1].rulesObject["$states"]).toBeUndefined()

        expect(declarations[4].rulesObject["$states"]).toBeUndefined()
        expect(declarations[5].rulesObject["$states"]).toBeUndefined()
    })

    it("should allow multiline values", function () {
        expect(declarations[0].rulesObject["border"].replace(/\s/g, "")).toBe("[1pxsolidred,2pxsolidrgba(255,170,50,.5),2pxdashedblue,5pxsolidblack]")
        expect(declarations[1].rulesObject["background"].replace(/\s/g, "")).toBe("[(url(..img/leyley.png)topleft,url(../img/lel.png)bottomcenter),url(../img/lol.png),#fd5]")
    })
})