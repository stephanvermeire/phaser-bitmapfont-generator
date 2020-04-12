const Generator= require("./index");

describe("index.js", ()=>{

    it("start an instance of Phaser", async ()=>{
        const generator = new Generator();
        const result = await generator.TextStyle2BitmapFont();
        expect(result).toEqual(undefined);
    })

})
