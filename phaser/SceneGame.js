var fs = require('fs');
const convert = require('xml-js');


class SceneGame extends Phaser.Scene {
    constructor() {
        super({
            active: true,
            visible: true,
            key: 'SceneGame',
        });
    }

    // preload(){
    //     console.log("preload")
    //     //this.load.svg('bg', 'assets/svg/bg.svg', {scale});
    // }
    async create() {
        console.log("scene created")

        const fontStyle = {
            fontFamily: 'AA_Bradybunch070214, Arial',
            fontSize: `72px`,
            stroke: '#000',
            strokeThickness: 4,
            align: 'center',
            color: '#ffffff',
            shadow: {
                offsetX: 0.4 * 4,
                offsetY: 0.4 * 4,
                blur: 0,
                fill: true,
                stroke: true,
                color: '#000000'
            }
        }


        let json = {
            "_declaration": {
                "_attributes": {
                    "version": "1.0"
                }
            },
            "font": {
                "info": {
                    "_attributes": {
                        "face": "bbunch",
                        "size": 12
                    }
                },
                "common": {},
                "pages": {
                    "page": {
                        "_attributes": {
                            "id": "0",
                            "file": `test.png`
                        }
                    }
                },
                "chars": {
                    "char": []
                }
            }
        };

        const rt = this.add.renderTexture(0, 0, 320, 100);
        let txt = this.add.text(0, 0, '', fontStyle);

        for (let i of ['a', 'b', '0']) {
            txt.setText(i);
            const metrics = txt.getTextMetrics();
            rt.draw(txt);

            json.font.chars.char.push({
                "_attributes": {
                    "id": txt.text.charCodeAt(0).toString(),
                    "x": txt.x.toString(),
                    "y": txt.y.toString(),
                    "width": txt.displayWidth.toString(),
                    "height": metrics.fontSize.toString(),
                    "xoffset": "0",
                    "yoffset": "0",
                    "xadvance": txt.displayWidth.toString(),
                    "page": "0"
                }
            });

            txt.x += txt.displayWidth;
        }

        const xml = convert.json2xml(json, {compact: true, ignoreComment: true, spaces: 4});
        fs.writeFileSync('test.xml', xml);

        //create snapshot
        const img = await new Promise((resolve) => {
            this.game.renderer.snapshotArea(0, 0, 100, 100, resolve);
        });

        //write png
        //var src = 'data:image/png;base64,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'
        var data = img.src.replace(/^data:image\/png;base64,/, "");

        fs.writeFileSync('test.png', data, {encoding: 'base64'});



        //close engine
        this.game.registry.get("close")();



    }

    saveXml(){
        console.log("saving xml file");
    }
}

module.exports = SceneGame;
