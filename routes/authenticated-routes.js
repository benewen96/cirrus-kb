// Routes in this module require authentication

var express = require('express');
var router = express.Router();
var AUTH_REQUIRED = false; // Controls whether this web app will require authentication and authorization.
var Handlebars = require('handlebars');
//include bodyparser middleware so we can get our markdown from AJAX
var bodyParser = require('body-parser');

//to parse markdown server side
var md = require('markdown-it')();
var conn = require('../controllers/salesforce_conn.js');
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
  console.log(req.body);

  conn.sobject("CRKB_Entry__c").create({ Name : req.body.title, Article__c : req.body.markdown, Author__c : req.body.author, Tags__c : req.body.tags}, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + req.body.title);
  });

  res.send(id);
});

//get the article with the following id
router.get('/browse/:kbId', function(req, res) {
  conn.sobject("CRKB_Entry__c").retrieve(req.params.kbId, function(err, entry) {
    if (err) { return console.error(err); }
    console.log("Name : " + entry.Name);
    return res.render('browseArticle', {
        helpers: {
          //handlebars helper functions to retrieve the id and (markdown rendered into html) content of an article
          article: function () { return new Handlebars.SafeString(md.render(entry.Article__c)); },
          name: function () { return new Handlebars.SafeString(entry.Name); }
        }
    });
  });
});

router.get('/browse', function(req, res) {
  var articles = [];

  conn.query("SELECT Id, Name FROM CRKB_Entry__c", function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);

    result.records.forEach((record) => {
      articles.push({id: record.Id, title: record.Name});
    });

    return res.render('browse', {
        article: articles
      }
    );

  });
});

module.exports = router;
