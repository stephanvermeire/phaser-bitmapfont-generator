const generator= require("./index");

(async()=>{

    let fontSize;
    let resolution;

    for(fontSize of [28]){
        for(resolution=4; resolution<=4; resolution++){

            let textStyle = {
                fontFamily: 'AAABrady Bunch Remastered',
                fontSize: `${resolution * fontSize}px`,
                align: 'center',
                stroke: '#000',
                strokeThickness: resolution,
                color: '#ffffff',
                shadow: {
                    offsetX: 0.5 * resolution,
                    offsetY: 0.5 * resolution,
                    blur: 0,
                    fill: true,
                    stroke: true,
                    color: '#000000'
                },
                testString: Phaser.GameObjects.RetroFont.TEXT_SET1
            };



            //metrics berekenen

            await generator.TextStyle2BitmapFont({
                //path: '../../public/phaser/bitmapfont',
                fileName: `BBwit${fontSize}@${resolution}x`,
                textStyle
            });

        }
    }


    process.exit(1);
})();
