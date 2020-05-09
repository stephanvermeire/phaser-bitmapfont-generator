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
                fontSize: '150px',
                color: '#000000',
                // shadow: {
                //     offsetX: 4,
                //     offsetY: 4,
                //     blur: 0,
                //     fill: true,
                //     stroke: true,
                //     color: '#000000'
                // },
            }
        }
    );

    //exit node
    return process.exit(1);


})();

