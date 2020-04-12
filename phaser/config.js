const Phaser = require('phaser');
const SceneGame = require('./SceneGame');

module.exports = {
    type: Phaser.CANVAS,
    width: 2520,
    height: 1080,
    autoFocus: false,
    render: {
        //antialiasGL: false
    },
    "render.transparent": true,
    backgroundColor: 'rgba(255,110,110,0)',
    scene: [SceneGame]
};
