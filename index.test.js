const generator= require("./index");
const fs = require('fs');
const fse = require('fs-extra');

describe("index.js", ()=>{

    afterAll(async()=>{

    });

    it("must generate a bitmapfont in a custom path", async ()=>{
        const result = await generator.TextStyle2BitmapFont({
            path: './mydir'
        });
        expect(result).toEqual(undefined);

        expect(fs.existsSync('./mydir/Arial20.png')).toEqual(true);
        fs.unlinkSync('./mydir/Arial20.png');

        expect(fs.existsSync('./mydir/Arial20.xml')).toEqual(true);
        fs.unlinkSync('./mydir/Arial20.xml');

        fse.removeSync('./myDir');
    });

    it("must generate a bitmapfont with a custom textStyle", async ()=>{
        const result = await generator.TextStyle2BitmapFont({
            textSet: '01234',
            textStyle: {
                fontFamily: 'Impact',
                fontSize: '50px',
                color: '#ffffff',
                shadow: {
                    offsetX: 1,
                    offsetY: 1,
                    blur: 0,
                    fill: true,
                    stroke: true,
                    color: '#000000'
                },
            }
        });
        expect(result).toEqual(undefined);

        expect(fs.existsSync('./Impact50.png')).toEqual(true);
        fs.unlinkSync('./Impact50.png');

        expect(fs.existsSync('./Impact50.xml')).toEqual(true);
        fs.unlinkSync('./Impact50.xml');
    });

    it("must generate a bitmapfont with a custom path and filename", async ()=>{
        const result = await generator.TextStyle2BitmapFont({
            path: './',
            fileName: 'myBitmapfont'
        });
        expect(result).toEqual(undefined);

        expect(fs.existsSync('./myBitmapfont.png')).toEqual(true);
        fs.unlinkSync('./myBitmapfont.png');

        expect(fs.existsSync('./myBitmapfont.xml')).toEqual(true);
        fs.unlinkSync('./myBitmapfont.xml');
    });

    it("must generate a bitmapfont using default props", async ()=>{
        const result = await generator.TextStyle2BitmapFont();
        expect(result).toEqual(undefined);

        expect(fs.existsSync('./Arial20.png')).toEqual(true);
        fs.unlinkSync('./Arial20.png');

        expect(fs.existsSync('./Arial20.xml')).toEqual(true);
        fs.unlinkSync('./Arial20.xml');
    });




})
