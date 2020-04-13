const Generator = require("../index");
const generator = new Generator();

(async ()=>{

    await generator
        .TextStyle2BitmapFont(
            {
                fontStyle: {
                    fontFamily: 'Arial',
                    fontSize: '25px',
                    color: '#19db6d',
                }
            }
        );

    await generator
        .TextStyle2BitmapFont(
            {
                fontStyle: {
                    fontFamily: 'Impact',
                    fontSize: '50px',
                    color: '#db7128',
                }
            }
        );

    return process.exit(1);

})();

