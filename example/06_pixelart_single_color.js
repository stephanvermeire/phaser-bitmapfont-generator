const generator = require("../index");


(async ()=>{


    //generate textures
    await generator.TextStyle2BitmapFont(
        {
            textStyle: {
                fontFamily: 'Impact',
                fontSize: '30px',
                color: '#ffffff',
            },
            antialias: false
        }
    );

    //exit node
    return process.exit(1);


})();

