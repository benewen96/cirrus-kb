// Routes in this module require authentication

var express = require('express');
var router = express.Router();
var AUTH_REQUIRED = false; // Controls whether this web app will require authentication and authorization.
var Handlebars = require('handlebars');
//include bodyparser middleware so we can get our markdown from AJAX
var bodyParser = require('body-parser');

//to parse markdown server side
var md = require('markdown-it')();

//so we can save our kb entries
var fs = require('fs');

//generates a random id to save the article
var makeid = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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

router.get('/', function(req, res) {
  return res.render('create');
});
/* When we get a POST request on create, use body-parser to retrieve
the markdown submitted then create a new file under kb folder
with the file name being the submit date that contains the
markdown.
*/
router.post('/create', function(req, res) {
  var id = makeid();
  fs.writeFile("kb/" + id + ".kb", req.body.markdown, function(err) {
    if(err) {
      return console.log(err);
    }
    console.log(req.body.markdown + " was saved!");
  });
  res.send(id);
});

//get the article with the following id
router.get('/browse/:kbId', function(req, res) {
  fs.readFile('kb/' + req.params.kbId + '.kb', 'utf8', function (err, data) {
    if (err) { throw err;  }
      return res.render('browseArticle', {
      helpers: {
        article: function () { return new Handlebars.SafeString(md.render(data)); },
        name: function () { return new Handlebars.SafeString(req.params.kbId); }
      }
    });

  });
});

router.get('/browse', function(req, res) {
  var articles = [];
  fs.readdir("kb/",function(err, files){
    if (err) {
      return console.error(err);
    }
    files.forEach( function (file){
      var article = file.toString();
      articles.push(article.substring(0, article.length-3));
      console.log(file);
    });
  });

  return res.render('browse', {
      article: articles
    }
  );
});

module.exports = router;
