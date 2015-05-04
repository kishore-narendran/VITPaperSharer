var express = require('express');
var path = require('path');
var PDFDocument = require('pdfkit');
var fs = require('fs');
var crypto = require('crypto');
var router = express.Router();

var homePage = function(req, res) {
    res.render('index', { title: 'VITPaperSharer' });
};

var uploadPaperPage = function(req, res) {
    res.render('upload', { title: 'VITPaperSharer' });
};

router.get('/', homePage);
router.get('/upload', uploadPaperPage);

module.exports = router;
