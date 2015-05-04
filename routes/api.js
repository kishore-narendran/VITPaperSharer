var express = require('express');
var path = require('path');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var crypto = require('crypto');
var status = require(path.join(__dirname, '..', 'status'));
var router = express.Router();

var uploadPaperAction = function(req, res) {

    var numberOfFiles = parseInt(req.body.number_of_files);
    var classNumber = parseInt(req.body.class_number);
    var title = req.body.title;
    var code  = req.body.code;
    var slot = req.body.slot;
    var type = req.body.type;
    var semester = req.body.semester + (parseInt(req.body.year) % 100).toString();

    var generatePDF = function(numberOfPapers) {
        var doc = new PDFDocument();
        var pdfName = classNumber+ '-' + type + '-' + code + '-' + slot + '-' + semester + ' (' + (numberOfPapers+1) + ')';
        doc.pipe(fs.createWriteStream('public/generated/'+ pdfName + '.pdf'));
        for(var i = 0; i < numberOfFiles; i++) {
            var fieldName = ('file' + ((i + 1).toString()));
            var name = req.files[fieldName].name;
            doc.image('public/uploads/' + name);
            if (i != numberOfFiles - 1) {
                doc.addPage();
            }
            fs.unlink('public/uploads/' + name);
        }
        doc.end();
        return ('public/generated/'+ pdfName + '.pdf');
    };

    var onInsert = function(err, result) {
        if(err) {
            res.json({result: status.failure});
        }
        else {
            res.json({result: status.success});
        }
    };
    var onUpdate = function(err, result) {
        if(err) {
            res.json({result: status.failure});
        }
        else {
            res.json({result: status.success});
        }
    };
    var onFindPapers = function(err, result) {
        var fileName;
        var files = [];
        if(err) {
            res.json({result: status.failure});
        }
        else if(result == null) {
            fileName = generatePDF(0);
            files.push(fileName);
            req.db.collection('papers').insert({class_number: classNumber, title: title, code: code, slot: slot, type: type, semester: semester, files: files}, onInsert);
        }
        else {
            var numberOfPapers = result.files.length;
            files = result.files;
            fileName = generatePDF(numberOfPapers);
            files.push(fileName);
            req.db.collection('papers').update({class_number: classNumber, title: title, code: code, slot: slot, type: type, semester: semester}, {$set: {files: files}}, {upsert: true}, onUpdate);
        }
    };
    req.db.collection('papers').findOne({class_number: classNumber, code: code, slot: slot, type: type, semester: semester}, onFindPapers);
};

router.post('/uploadpaper', uploadPaperAction);

module.exports = router;
