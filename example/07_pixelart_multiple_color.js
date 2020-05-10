const generator = require("../index");


(async ()=>{


    //generate textures
    await generator.TextStyle2BitmapFont(
        {
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
            },
            antialias: false,
            maxNumberOfColours: 3
        }
    );

    //exit node
    return process.exit(1);


})();

