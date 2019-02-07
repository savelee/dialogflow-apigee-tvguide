var express = require('express');
var router = express.Router();
let app = require('../app.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.app.get('traktAuthUrl'));
  res.render('index', { title: 'Trakt.tv', url: req.app.get('traktAuthUrl') });
});

module.exports = router;
