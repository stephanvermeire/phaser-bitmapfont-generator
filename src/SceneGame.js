const fs = require('fs');
const fse = require('fs-extra');
const nodepath = require('path');
const convert = require('xml-js');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const Jimp = require('jimp');
const Pixelizer = require('image-pixelizer');


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
        const margin = (typeof props.margin === 'number') ? props.margin : 1;

        const textSet = props.textSet || Phaser.GameObjects.RetroFont.TEXT_SET1;

        const compressionOptions =  (typeof props.compression === 'null') ? NULL : props.compression || {quality: [ .3, .5 ]};
        const maxNumberOfColors = props.maxNumberOfColours;
        const antialias = props.antialias !== false;


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
            offsetX = Math.ceil(textStyle.shadow.offsetX) || 0;
            offsetY = Math.ceil(textStyle.shadow.offsetY) || 0;
            metrics.fontSize += offsetY;
            metrics.descent += offsetY;
            textStyle.metrics = metrics;
            txt.setStyle(textStyle);
        }

        for (let i = 0; i < textSet.length; i++) {
            txt.setText(textSet[i]);

            const displayWidth = txt.displayWidth;
            const id = txt.text.charCodeAt(0).toString();

            if (txt.x + displayWidth + offsetX > maxWidth) {
                txt.x = 0;
                txt.y += metrics.fontSize + margin;
            }
            //add space in order to capture shadow correctly
            txt.setText(`${textSet[i]} `);
            rt.draw(txt);

            json.font.chars.char.push({
                "_attributes": {
                    "id": id,
                    "x": txt.x.toString(),
                    "y": txt.y.toString(),
                    "width": (displayWidth + offsetX).toString(),
                    "height": metrics.fontSize.toString(),
                    "xoffset": "0",
                    "yoffset": "0",
                    "xadvance": displayWidth.toString(),
                    "page": "0"
                }
            });

            txt.x += displayWidth + offsetX + margin;
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

        // ==== processing the image ====

        //convert image to buffer
        var data = img.src.replace(/^data:image\/png;base64,/, "");
        let buffer = Buffer.from(data, 'base64');

        if(!antialias || maxNumberOfColors){
            let image = await Jimp.read(buffer);

            //antialias
            if(!antialias){
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                    // x, y is the position of this pixel on the image
                    // idx is the position start position of this rgba tuple in the bitmap Buffer
                    // this is the image

                    var red = this.bitmap.data[idx + 0];
                    var green = this.bitmap.data[idx + 1];
                    var blue = this.bitmap.data[idx + 2];
                    var alpha = this.bitmap.data[idx + 3];

                    this.bitmap.data[idx + 3] = (alpha > 128) ? 255 : 0;

                    // rgba values run from 0 - 255
                    // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
                });
            }

            //reduce number of colors
            if(maxNumberOfColors){
                // Create Options for Pixelizer.
                let options = new Pixelizer.Options()
                    .setMaxIteration(4)
                    .setNumberOfColors(props.maxNumberOfColours);

                // Create Pixelizer bitmap from jimp.
                let inputBitmap = new Pixelizer.Bitmap(
                    image.bitmap.width,
                    image.bitmap.height,
                    image.bitmap.data
                );

                // Pixelize!
                let outputBitmap =
                    new Pixelizer(inputBitmap, options).pixelize();

                // Override jimp bitmap and output image.
                image.bitmap.width = outputBitmap.width;
                image.bitmap.height = outputBitmap.height;
                image.bitmap.data = outputBitmap.data;
            }

            //convert image back to buffer
            buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        }

        //compression is done with imageminPngquant because it has the best result
        if(compressionOptions){
            buffer = await imagemin.buffer(buffer, {
                plugins: [
                    imageminPngquant(compressionOptions)
                ]
            });
        }


        fse.writeFileSync(nodepath.join(path, `${fileName}.png`),
            buffer
            );


        //close engine
        this.game.registry.get("close")();
    }

}

module.exports = SceneGame;
