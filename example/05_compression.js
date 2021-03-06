const generator = require("../index");


(async ()=>{


    //generate textures
    await generator.TextStyle2BitmapFont(
        {
            compression: {
                speed: 4,
                quality: [.1, .3]
            },
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

