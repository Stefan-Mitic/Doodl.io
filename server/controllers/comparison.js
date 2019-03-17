const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const readImage = function (filepath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filepath, function (err, data) {
            if (err) return reject(err);
            return resolve(data);
        });
    });
};

var img1 = fs.createReadStream('./controllers/img3.png').pipe(new PNG()).on('parsed', doneReading),
    img2 = fs.createReadStream('./controllers/img2.png').pipe(new PNG()).on('parsed', doneReading),
    filesRead = 0;

function doneReading() {
    if (++filesRead < 2) {
        return console.log('not done yet');
    }
    var diff = new PNG({width: img1.width, height: img1.height});

    var numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
    console.log(numDiffPixels);
}
