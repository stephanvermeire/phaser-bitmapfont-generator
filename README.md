# phaser-bitmapfont-generator

Node.js module that generates bitmap fonts (xml + png) from a Phaser 3 TextStyle json object

## install
```
npm install -D @rtpa/phaser-bitmapfont-generator
```
or

```
yarn add @rtpa/phaser-bitmapfont-generator --dev 
```

## generate an xml bitmap font from a Phaser3 TextStyle object

You can find the details of the Phaser TextStyle configuration object in the documentation: https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle

### examples:

The following basic example generates a bitmapfont (Arial20.xml and Arial20.png) from the default settings
```
const generator = require('@rtpa/phaser-bitmapfont-generator');

(async ()=>{

    //generate textures
    await generator.TextStyle2BitmapFont();

    //exit node
    return process.exit(1);

})();
```


You are probably interested in generating a more exciting bitmap font. Here is an example with a nicer fontFamily and a border:
```
const generator = require('@rtpa/phaser-bitmapfont-generator');

(async () => {

    //generate textures
    await generator.TextStyle2BitmapFont(
        {
            path: './mydir',
            fileName: 'myBitmapfont',
            textSet: 'abcde12345=x+',
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
        }
    );

    //exit node
    return process.exit(1);

})();
```

## properties

the TextStyle2BitmapFont function accepts a configuration object that has the following properties:

| Property | Type | Description | Default value |
| --- | --- | --- | --- |
| path | string |the file path that is used to write the .xml and .png files to | './' |
| fileName | string | The file name of the .xml and .png file.  | \<fontFamily\> + \<fontSize\> |
| margin | number | Number of pixels that the chars will be separated in the .png file | 2  |
| textSet | string | A string that contains all characters that will be included in the bitmap font | [Phaser.GameObjects.RetroFont.TEXT_SET1](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.RetroFont.html)  |
| textStyle | TextStyle object | A valid Phaser 3 [TextStyle](https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle) configuration Object | {fontFamily: 'Arial', fontSize: '20px'}
| compression | imagemin-pngquant options object (or NULL to disable compression) | A valid [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant) configuration Object | {quality: [ .3, .5 ]}

