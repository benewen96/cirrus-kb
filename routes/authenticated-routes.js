// Routes in this module require authentication

var express = require('express');
var router = express.Router();
var AUTH_REQUIRED = false; // Controls whether this web app will require authentication and authorization.

//include bodyparser middleware so we can get our markdown from AJAX
var bodyParser = require('body-parser');

//so we can save our kb entries
var fs = require('fs');

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

/* When we get a POST request on create, use body-parser to retrieve
   the markdown submitted then create a new file under kb folder
   with the file name being the submit date that contains the
   markdown.
*/
router.post('/create', function(req, res) {
  var now = new Date();
  fs.writeFile("test/" + now + ".kb", req.body.markdown, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log(req.body.markdown + " was saved!");
  });
})

module.exports = router;
