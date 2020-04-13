const Phaser = require('./phaser/Phaser.js');
const config = require('./phaser/config');

class Generator {
    constructor() {
    }

    TextStyle2BitmapFont(props = {}){

        return new Promise((resolve)=>{
            var game = new Phaser.Game(config);
            game.registry.set("props", props);
            game.registry.set("close", ()=>{
                game.destroy();
                resolve();
            })
        });

    }
}

module.exports = Generator;

