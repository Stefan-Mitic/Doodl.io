// TODO: clean up file

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

exports.compareImages = function (req, res) {
    let filename1 = req.body.filename1;
    let filename2 = req.body.filename2;
    fs.readFile(filename1, function (err, data1) {
        if (err) res.status(500).end(err);
        let img1 = new PNG(data1);
        fs.readFile(filename2, function (err, data2) {
            if (err) res.status(500).end(err);
            let img2 = new PNG(data2);
            let diff = new PNG({width: img1.width, height: img1.height});
            let pixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
            res.json({
                image1: img1,
                image2: img2,
                difference: pixels,
            });
        });
    });
};
