const generator = require("../index");


(async () => {


    //generate textures
    await generator.TextStyle2BitmapFont(
        {
            path: './mydir',
            fileName: 'myBitmapfont',
            margin: 4,
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
        }
    );

    //exit node
    return process.exit(1);


})();

