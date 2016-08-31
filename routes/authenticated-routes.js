// Routes in this module require authentication

var express = require('express');
var router = express.Router();
var AUTH_REQUIRED = false; // Controls whether this web app will require authentication and authorization.

//include bodyparser middleware so we can get our markdown from AJAX
var bodyParser = require('body-parser');

// middleware that is specific to this router
router.use(bodyParser.json());

router.use(function authorized(req, res, next) {
  if (req.isAuthenticated() || !AUTH_REQUIRED) {
  	return next();
  }
  	res.redirect('/auth/forcedotcom?redirect='+req.originalUrl);
});

function htmlExt(route) {
  return '/' + route + '|' + route + '.html';
}

router.get('/about', function(req, res) {
	return res.render('about');
});

router.get('/create', function(req, res) {
	return res.render('create');
});

router.post('/create', function(req, res) {
  console.log(req.body.markdown);
})

module.exports = router;
