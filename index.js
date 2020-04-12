const Phaser = require('./phaser/Phaser.js');
const config = require('./phaser/config');

class Generator {
    constructor() {
    }

    TextStyle2BitmapFont(){

        return new Promise((resolve)=>{
            console.log("create phaser");
            var game = new Phaser.Game(config);
            game.registry.set("close", ()=>{
                console.log('close');
                game.destroy();
                resolve();
            })
        });




    }
}

module.exports = Generator;

