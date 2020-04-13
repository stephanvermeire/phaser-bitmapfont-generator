const Generator= require("../index");
const generator = new Generator();


(async ()=>{


    //generate textures
    await generator.TextStyle2BitmapFont();

    //exit node
    return process.exit(1);


})();

