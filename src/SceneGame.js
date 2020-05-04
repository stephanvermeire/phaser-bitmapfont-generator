const fs = require('fs');
const fse = require('fs-extra');
const nodepath = require('path');
const convert = require('xml-js');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');


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

        let textStyle = props.textStyle || {};
        if (!textStyle.fontFamily) textStyle.fontFamily = 'Arial';
        if (!textStyle.fontSize) textStyle.fontSize = '20px';
        if (!textStyle.testString) textStyle.testString = Phaser.GameObjects.RetroFont.TEXT_SET1;

        const fontSize = Number(textStyle.fontSize.replace('px', ''));

        const fileName = props.fileName || `${textStyle.fontFamily}${fontSize}`;
        const path = props.path || './';

        const textSet = props.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1;

        const compressionOptions =  (typeof props.compression === 'null') ? NULL : props.compression || {quality: [ .3, .5 ]};


        let json = {
            "_declaration": {
                "_attributes": {
                    "version": "1.0"
                }
            },
            "font": {
                "info": {
                    "_attributes": {
                        "face": textStyle.fontFamily,
                        "size": fontSize
                    }
                },
                "common": {
                    "_attributes": {
                        "lineHeight": 0,
                        "base": 0
                    }
                },
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

        let txt = this.add.text(0, 0, textSet, textStyle);
        const metrics = txt.getTextMetrics();

        //make rough estimate of the required canvas width
        const maxWidth = Math.ceil(Math.sqrt(txt.width * txt.height)/512) * 512;
        const rt = this.add.renderTexture(0, 0, maxWidth, 2048);

        txt.setText('');

        //correct fontSize properties for shadow
        let offsetX = 0;
        let offsetY = 0;
        if (!textStyle.metrics && textStyle.shadow) {
            let offsetX = textStyle.shadow.offsetX || 0;
            let offsetY = textStyle.shadow.offsetY || 0;
            metrics.fontSize += offsetY;
            metrics.descent += offsetY;
            textStyle.metrics = metrics;
            txt.setStyle(textStyle);
        }

        for (let i = 0; i < textSet.length; i++) {
            txt.setText(textSet[i]);

            if (txt.x + txt.displayWidth + offsetX > maxWidth) {
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

            txt.x += txt.displayWidth + offsetX;
        }
        txt.setText('');

        //add common values
        json.font.common._attributes.lineHeight = (metrics.fontSize - metrics.descent).toString();
        json.font.common._attributes.base = metrics.descent.toString();


        fse.ensureDirSync(path);


        const xml = convert.json2xml(json, {compact: true, ignoreComment: true, spaces: 4});
        fse.writeFileSync(nodepath.join(path, `${fileName}.xml`), xml);

        //create snapshot
        const img = await new Promise((resolve) => {
            this.game.renderer.snapshotArea(0, 0, maxWidth, txt.y + metrics.fontSize, resolve);
        });

        //write png
        var data = img.src.replace(/^data:image\/png;base64,/, "");

        let buffer = Buffer.from(data, 'base64');

        if(compressionOptions){
            buffer = await imagemin.buffer(buffer, {
                plugins: [
                    imageminPngquant(compressionOptions)
                ]
            });
        }


        fse.writeFileSync(nodepath.join(path, `${fileName}.png`),
            buffer
            //{encoding: 'base64'}
            );


        //close engine
        this.game.registry.get("close")();
    }

}

module.exports = SceneGame;
