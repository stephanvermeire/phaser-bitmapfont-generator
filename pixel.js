var Jimp = require('jimp');
const Pixelizer = require('image-pixelizer');

Jimp.read('example3.png')
    .then(lenna => {
        // Create Pixelizer bitmap from jimp.
        let inputBitmap = new Pixelizer.Bitmap(
            lenna.bitmap.width,
            lenna.bitmap.height,
            lenna.bitmap.data
        );


        // Pixelizer processing code...

        // Create Options for Pixelizer.
        let options = new Pixelizer.Options()
            .setPixelSize(1)
            .setColorDistRatio(0.5)
            .setClusterThreshold(0.1)
            .setMaxIteration(10)
            .setNumberOfColors(2);

        // Pixelize!
        let outputBitmap =
            new Pixelizer(inputBitmap, options).pixelize();

        // Override jimp bitmap and output image.
        lenna.bitmap.width = outputBitmap.width;
        lenna.bitmap.height = outputBitmap.height;
        lenna.bitmap.data = outputBitmap.data;
        lenna.write('example3-out.png');
    })
    .catch(err => {
        console.error(err);
    });
