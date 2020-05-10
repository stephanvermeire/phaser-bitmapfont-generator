var Jimp = require('jimp');
const Pixelizer = require('image-pixelizer');

Jimp.read('example.png')
    .then(image => {


        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            // x, y is the position of this pixel on the image
            // idx is the position start position of this rgba tuple in the bitmap Buffer
            // this is the image

            var red = this.bitmap.data[idx + 0];
            var green = this.bitmap.data[idx + 1];
            var blue = this.bitmap.data[idx + 2];
            var alpha = this.bitmap.data[idx + 3];

            this.bitmap.data[idx + 3] = (alpha > 128) ? 255 : 0;

            // rgba values run from 0 - 255
            // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
        });

        // Create Options for Pixelizer.
        let options = new Pixelizer.Options()
            .setMaxIteration(10)
            .setNumberOfColors(16);

        // Create Pixelizer bitmap from jimp.
        let inputBitmap = new Pixelizer.Bitmap(
            image.bitmap.width,
            image.bitmap.height,
            image.bitmap.data
        );

        // Pixelize!
        let outputBitmap =
            new Pixelizer(inputBitmap, options).pixelize();

        // Override jimp bitmap and output image.
        image.bitmap.width = outputBitmap.width;
        image.bitmap.height = outputBitmap.height;
        image.bitmap.data = outputBitmap.data;

        image.write('example3-out.png');
        return;




    })
    .catch(err => {
        console.error(err);
    });
