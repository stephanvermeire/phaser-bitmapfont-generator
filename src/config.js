const SceneGame = require('./SceneGame');

module.exports = {
    type: Phaser.CANVAS,
    width: 2048,
    height: 2048,
    autoFocus: false,
    banner: false,
    render: {
        //antialiasGL: false
    },
    "render.transparent": true,
    backgroundColor: 'rgba(255,110,110,0)',
    scene: [SceneGame]
};
