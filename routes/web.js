var express = require('express');
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
