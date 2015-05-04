var express = require('express');
var path = require('path');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var router = express.Router();

var homePage = function(req, res) {
    res.render('index', { title: 'VITPaperSharer' });
};

var uploadPaperPage = function(req, res) {
    res.render('upload', { title: 'VITPaperSharer' });
};

var uploadPaperAction = function(req, res) {

    var numberOfFiles = parseInt(req.body.number_of_files);
    var classNumber = req.body.class_number;
    var title = req.body.title;
    var code  = req.body.code;
    var slot = req.body.slot;
    var doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('public/generated/output.pdf'));
    for(var i = 0; i < numberOfFiles; i++) {
        var fieldName = ('file' + ((i+1).toString()));
        var name = req.files[fieldName].name;
        doc.image('public/uploads/' + name);
        if(i != numberOfFiles-1){
            doc.addPage();
        }
        fs.unlink('public/uploads/' + name);
    }
    doc.end();
    res.json({});
};
router.get('/', homePage);
router.get('/upload', uploadPaperPage);
router.post('/uploadpaper', uploadPaperAction);

module.exports = router;
