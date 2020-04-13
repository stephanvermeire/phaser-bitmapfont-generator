const fs = require('fs');
const fse = require('fs-extra');
const nodepath = require('path');
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
        //quick and dirty hack to wait for data to be available in the registry
        await new Promise(resolve => setTimeout(resolve, 5));

        const props = this.game.registry.get("props");

        let fontStyle = props.fontStyle || {};
        if(!fontStyle.fontFamily) fontStyle.fontFamily = 'Arial';
        if(!fontStyle.fontSize) fontStyle.fontSize = '20px';

        const fontSize = Number(fontStyle.fontSize.replace('px', ''));

        const fileName = props.fileName || `${fontStyle.fontFamily}${fontSize}`;
        const path = props.path || './';

        const textSet = props.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1;


        let json = {
            "_declaration": {
                "_attributes": {
                    "version": "1.0"
                }
            },
            "font": {
                "info": {
                    "_attributes": {
                        "face": fontStyle.fontFamily,
                        "size": fontSize
                    }
                },
                "common": {},
                "pages": {
                    "page": {
                        "_attributes": {
                            "id": "0",
                            "file": `${fileName}.png`
                        }
                    }
                },
                "chars": {
                    "char": []
                }
            }
        };

        const maxWidth = 512;
        const rt = this.add.renderTexture(0, 0, maxWidth, 2048);
        let txt = this.add.text(0, 0, '', fontStyle);
        const metrics = txt.getTextMetrics();

        for (let i = 0; i<textSet.length; i++) {
            txt.setText(textSet[i]);

            if(txt.x + txt.displayWidth > maxWidth){
                txt.x = 0;
                txt.y += metrics.fontSize;
            }
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
        txt.setText('');

        fse.ensureDirSync(path);


        const xml = convert.json2xml(json, {compact: true, ignoreComment: true, spaces: 4});
        fse.writeFileSync(nodepath.join(path, `${fileName}.xml`), xml);

        //create snapshot
        const img = await new Promise((resolve) => {
            this.game.renderer.snapshotArea(0, 0, maxWidth, txt.y + metrics.fontSize, resolve);
        });

        //write png
        var data = img.src.replace(/^data:image\/png;base64,/, "");
        fs.writeFileSync(nodepath.join(path, `${fileName}.png`), data, {encoding: 'base64'});


        //close engine
        this.game.registry.get("close")();
    }

}

module.exports = SceneGame;
