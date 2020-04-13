const generator= require("../index");


(async ()=>{


    //generate textures
    await generator.TextStyle2BitmapFont();

    //exit node
    return process.exit(1);


})();

