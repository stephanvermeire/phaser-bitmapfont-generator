// this is an ingenius hack that allows us to run Phaser without a browser
// ... and yes, it took some time to figure out how to do this

const  Canvas = require('canvas');
const jsdom = require('jsdom');
const dom = new jsdom.JSDOM(null);
const document = dom.window.document;
const window = dom.window;
window.focus = ()=>{};


// expose a few things to all the modules
global.document = document;
global.window = window;
global.Canvas = Canvas;
global.Image = Canvas.Image;
global.window.CanvasRenderingContext2D = 'foo'; // let Phaser think that we have a canvas
global.window.Element = undefined;
global.navigator = {userAgent: 'Custom'}; // could be anything

// fake the xml http request object because Phaser.Loader uses it
global.XMLHttpRequest = function() {};

global.Phaser = Phaser = require('phaser');

module.exports = Phaser;
