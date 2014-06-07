var FileSystem  = require("fs"),
    Utils       = require("../lib/utils")

var source      = (new Buffer(FileSystem.readFileSync("./demo/style.uscss"))).toString(),
    declarations = Utils.getDeclarations(source)

describe("Declaration splitting", function () {

    it("should be resulted with 6 declarations in total", function () {
        expect(declarations.length).toBe(6)
    })

})

describe("Declaration class", function () {

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
        expect(declarations[1].selector).toBe("a")

        expect(declarations[4].selector).toBe("p")
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

        expect(declarations[1].rulesObject["font-family"]).toBe("helvetica, arial, sans-serif")
        expect(declarations[1].rulesObject["display"]).toBe("[block, none, block]")
        expect(declarations[1].rulesObject["color"]).toBe("[#eee, #ddd, red]")
        expect(declarations[1].rulesObject["text-decoration"]).toBe("none")
        expect(declarations[1].rulesObject["background"].replace(/\s/g, "")).toBe("[(url(..img/leyley.png)topleft,url(../img/lel.png)bottomcenter),url(../img/lol.png),#fd5]")

        expect(declarations[4].rulesObject["color"]).toBe("[blue, red, yellow, green]")
        expect(declarations[4].rulesObject["background"].replace(/\s/g, "")).toBe("[url(lel.png),(url(lol.png)leftcenter,url(ley.png)rightbottom),blue,#f08]")

        expect(declarations[5].rulesObject["color"]).toBe("red")
        expect(declarations[5].rulesObject["background"]).toBe("[blue, red]")
    })

    it("should allow multiline values", function () {
        expect(declarations[0].rulesObject["border"].replace(/\s/g, "")).toBe("[1pxsolidred,2pxsolidrgba(255,170,50,.5),2pxdashedblue,5pxsolidblack]")
        expect(declarations[1].rulesObject["background"].replace(/\s/g, "")).toBe("[(url(..img/leyley.png)topleft,url(../img/lel.png)bottomcenter),url(../img/lol.png),#fd5]")
        expect(declarations[4].rulesObject["background"].replace(/\s/g, "")).toBe("[url(lel.png),(url(lol.png)leftcenter,url(ley.png)rightbottom),blue,#f08]")
    })

    it("should get $states properly", function () {
        expect(declarations[0]["states"][0]).toBe("")
        expect(declarations[0]["states"][1]).toBe(":hover")
        expect(declarations[0]["states"][2]).toBe(":active .inner-element")
        expect(declarations[0]["states"][3]).toBe(".small")

        expect(declarations[1]["states"][0]).toBe("")
        expect(declarations[1]["states"][1]).toBe(":active")
        expect(declarations[1]["states"][2]).toBe(":hover")
        expect(declarations[1]["states"][3]).toBe(".big")

        expect(declarations[4]["states"][0]).toBe("")
        expect(declarations[4]["states"][1]).toBe(":not(.hede)")
        expect(declarations[4]["states"][2]).toBe(" a")
        expect(declarations[4]["states"][3]).toBe(" i em")

        expect(declarations[5]["states"][0]).toBe("")
        expect(declarations[5]["states"][1]).toBe(":last-child")
    })

    it("should delete pseudo-property $state from output", function () {
        expect(declarations[0].rulesObject["$states"]).toBeUndefined()
        expect(declarations[1].rulesObject["$states"]).toBeUndefined()

        expect(declarations[4].rulesObject["$states"]).toBeUndefined()
        expect(declarations[5].rulesObject["$states"]).toBeUndefined()
    })

    it("should set STATE-RULES properly", function () {
        expect(declarations[0].stateRules[0]["state"]).toBe("")
        expect(declarations[0].stateRules[0]["rules"]["font-family"]).toBe("helvetica, arial, sans-serif")
        expect(declarations[0].stateRules[0]["rules"]["display"]).toBe("block")
        expect(declarations[0].stateRules[0]["rules"]["text-decoration"]).toBe("none")
        expect(declarations[0].stateRules[0]["rules"]["color"]).toBe("blue")
        expect(declarations[0].stateRules[0]["rules"]["margin"]).toBe("0")
        expect(declarations[0].stateRules[0]["rules"]["font-size"]).toBe("1em")
        expect(declarations[0].stateRules[0]["rules"]["background"]).toBe("red")
        expect(declarations[0].stateRules[0]["rules"]["border"]).toBe("1px solid red")

        expect(declarations[0].stateRules[1]["state"]).toBe(":hover")
        expect(declarations[0].stateRules[1]["rules"]["font-family"]).toBeUndefined()
        expect(declarations[0].stateRules[1]["rules"]["display"]).toBeUndefined()
        expect(declarations[0].stateRules[1]["rules"]["text-decoration"]).toBeUndefined()
        expect(declarations[0].stateRules[1]["rules"]["color"]).toBe("red")
        expect(declarations[0].stateRules[1]["rules"]["margin"]).toBe("0 50px")
        expect(declarations[0].stateRules[1]["rules"]["font-size"]).toBe("1em")
        expect(declarations[0].stateRules[1]["rules"]["background"]).toBe("rgba(255,255,255,.5)")
        expect(declarations[0].stateRules[1]["rules"]["border"]).toBe("2px solid rgba(255,170,50,.5)")

        expect(declarations[0].stateRules[2]["state"]).toBe(":active .inner-element")
        expect(declarations[0].stateRules[2]["rules"]["font-family"]).toBeUndefined()
        expect(declarations[0].stateRules[2]["rules"]["display"]).toBeUndefined()
        expect(declarations[0].stateRules[2]["rules"]["text-decoration"]).toBeUndefined()
        expect(declarations[0].stateRules[2]["rules"]["background"]).toBeUndefined()
        expect(declarations[0].stateRules[2]["rules"]["color"]).toBeUndefined()
        expect(declarations[0].stateRules[2]["rules"]["margin"]).toBe("0 25px")
        expect(declarations[0].stateRules[2]["rules"]["font-size"]).toBe("1.1em")
        expect(declarations[0].stateRules[2]["rules"]["border"]).toBe("2px dashed blue")

        expect(declarations[0].stateRules[3]["state"]).toBe(".small")
        expect(declarations[0].stateRules[3]["rules"]["font-family"]).toBeUndefined()
        expect(declarations[0].stateRules[3]["rules"]["display"]).toBeUndefined()
        expect(declarations[0].stateRules[3]["rules"]["text-decoration"]).toBeUndefined()
        expect(declarations[0].stateRules[3]["rules"]["background"]).toBeUndefined()
        expect(declarations[0].stateRules[3]["rules"]["color"]).toBeUndefined()
        expect(declarations[0].stateRules[3]["rules"]["margin"]).toBe("10px")
        expect(declarations[0].stateRules[3]["rules"]["font-size"]).toBe(".8em")
        expect(declarations[0].stateRules[3]["rules"]["border"]).toBe("5px solid black")

        // --------------------------------------------------------------------------------

        expect(declarations[1].stateRules[0]["state"]).toBe("")
        expect(declarations[1].stateRules[0]["rules"]["font-family"]).toBe("helvetica, arial, sans-serif")
        expect(declarations[1].stateRules[0]["rules"]["display"]).toBe("block")
        expect(declarations[1].stateRules[0]["rules"]["text-decoration"]).toBe("none")
        expect(declarations[1].stateRules[0]["rules"]["color"]).toBe("#eee")
        expect(declarations[1].stateRules[0]["rules"]["background"]).toBe("url(..img/leyley.png) top left, url(../img/lel.png) bottom center")

        expect(declarations[1].stateRules[1]["state"]).toBe(":active")
        expect(declarations[1].stateRules[1]["rules"]["font-family"]).toBeUndefined()
        expect(declarations[1].stateRules[1]["rules"]["text-decoration"]).toBeUndefined()
        expect(declarations[1].stateRules[1]["rules"]["display"]).toBe("none")
        expect(declarations[1].stateRules[1]["rules"]["color"]).toBe("#ddd")
        expect(declarations[1].stateRules[1]["rules"]["background"]).toBe("url(../img/lol.png)")

        expect(declarations[1].stateRules[2]["state"]).toBe(":hover")
        expect(declarations[1].stateRules[2]["rules"]["font-family"]).toBeUndefined()
        expect(declarations[1].stateRules[2]["rules"]["text-decoration"]).toBeUndefined()
        expect(declarations[1].stateRules[2]["rules"]["display"]).toBe("block")
        expect(declarations[1].stateRules[2]["rules"]["color"]).toBe("red")
        expect(declarations[1].stateRules[2]["rules"]["background"]).toBe("#fd5")

        // --------------------------------------------------------------------------------

        expect(declarations[4].stateRules[0]["state"]).toBe("")
        expect(declarations[4].stateRules[0]["rules"]["color"]).toBe("blue")
        expect(declarations[4].stateRules[0]["rules"]["background"]).toBe("url(lel.png)")

        expect(declarations[4].stateRules[1]["state"]).toBe(":not(.hede)")
        expect(declarations[4].stateRules[1]["rules"]["color"]).toBe("red")
        expect(declarations[4].stateRules[1]["rules"]["background"]).toBe("url(lol.png) left center, url(ley.png) right bottom")

        expect(declarations[4].stateRules[2]["state"]).toBe(" a")
        expect(declarations[4].stateRules[2]["rules"]["color"]).toBe("yellow")
        expect(declarations[4].stateRules[2]["rules"]["background"]).toBe("blue")

        expect(declarations[4].stateRules[3]["state"]).toBe(" i em")
        expect(declarations[4].stateRules[3]["rules"]["color"]).toBe("green")
        expect(declarations[4].stateRules[3]["rules"]["background"]).toBe("#f08")

        // --------------------------------------------------------------------------------

        expect(declarations[5].stateRules[0]["state"]).toBe("")
        expect(declarations[5].stateRules[0]["rules"]["color"]).toBe("red")
        expect(declarations[5].stateRules[0]["rules"]["background"]).toBe("blue")

        expect(declarations[5].stateRules[1]["state"]).toBe(":last-child")
        expect(declarations[5].stateRules[1]["rules"]["color"]).toBeUndefined()
        expect(declarations[5].stateRules[1]["rules"]["background"]).toBe("red")

    })
})