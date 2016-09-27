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
the markdown submitted then create a new kb article and send to salesforce
*/
router.post('/create', function(req, res) {
  console.log(req.body);

  conn.sobject("CRKB_Entry__c").create({ Title__c : req.body.title, Article__c : req.body.markdown, Author__c : req.body.author, Tags__c : req.body.tags}, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + req.body.title);
  });
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
          name: function () { return new Handlebars.SafeString(entry.Title__c); }
        }
    });
  });
});

//this endpoint returns the entire kb in a json object
router.get('/json', function(req, res) {
  var articles = [];
  conn.query("SELECT Id, Title__c, Author__c, Article__c FROM CRKB_Entry__c", function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);

    result.records.forEach((record) => {
      articles.push({
        id: record.Id,
        title: record.Title__c,
        author: record.Author__c,
        article: record.Article__c,
      });
    });

    return res.json(articles);

  });
});

//browse all articles
router.get('/browse', function(req, res) {
  var articles = [];

  conn.query("SELECT Id, Name, Title__c FROM CRKB_Entry__c", function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);

    result.records.forEach((record) => {
      articles.push({id: record.Id, title: record.Title__c});
    });

    return res.render('browse', {
        //handlebars variable that stores the articles
        article: articles
      }
    );

  });
});

module.exports = router;
