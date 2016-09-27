// Routes in this module require authentication

 // Controls whether this web app will require authentication and authorization.
const AUTH_REQUIRED = false;

const express = require('express');

const Handlebars = require('handlebars');
// include bodyparser middleware so we can get our markdown from AJAX
const bodyParser = require('body-parser');

// to parse markdown server side
const md = require('markdown-it')();
const conn = require('../controllers/salesforce_conn.js');

const router = new express.Router();

// middleware that is specific to this router
router.use(bodyParser.json());

router.use((req, res, next) => {
  if (req.isAuthenticated() || !AUTH_REQUIRED) {
    return next();
  }
  return res.redirect(`/auth/forcedotcom?redirect=${req.originalUrl}`);
});

// function htmlExt(route) {
//   return `/${route}|${route}.html`;
// }

// returns create handlebars page
router.get('/create', (req, res) => res.render('create'));

// returns create handlebars page
router.get('/', (req, res) => res.render('create'));

/* When we get a POST request on create, use body-parser to retrieve
the markdown submitted then create a new kb article and send to salesforce
*/
router.post('/create', (req, res) => {
  // create a new entry on salesforce
  conn.sobject('CRKB_Entry__c').create({
    Title__c: req.body.title,
    Article__c: req.body.markdown,
    Author__c: req.body.author,
  }, (err, ret) => {
    if (err || !ret.success) { return console.error(err, ret); }
    // return the success object back to ajax for id of record
    return res.send(ret);
  });
});

// get the article with the following id
router.get('/browse/:kbId', (req, res) => {
  // retrieve the entry from salesforce with the id from the url
  conn.sobject('CRKB_Entry__c').retrieve(req.params.kbId, (err, entry) => {
    if (err) { return console.error(err); }
    // returns the browseArticle handlebars page
    return res.render('browseArticle', {
      helpers: {
        // handlebars helper functions to retrieve the id and
        // (markdown rendered into html) content of an article
        article() { return new Handlebars.SafeString(md.render(entry.Article__c)); },
        name() { return new Handlebars.SafeString(entry.Title__c); },
        author() { return new Handlebars.SafeString(entry.Author__c); },
      },
    });
  });
});

// this endpoint returns the entire kb in a json object
router.get('/json', (req, res) => {
  // articles is an array of json articles from sf
  const articles = [];
  // query salesforce for all articles
  conn.query('SELECT Id, Title__c, Author__c, Article__c, CreatedDate FROM CRKB_Entry__c', (err, result) => {
    if (err) { return console.error(err); }
    console.log(`total : ${result.totalSize}`);
    console.log(`fetched : ${result.records.length}`);

    // for each record from the query, add it to the articles json
    result.records.forEach((record) => {
      articles.push({
        id: record.Id,
        title: record.Title__c,
        author: record.Author__c,
        article: record.Article__c,
        time: record.CreatedDate,
      });
    });
    // return the json object to whoever requested it
    // this is used in browse.js to get all the entries but could be used to export kb data
    return res.json(articles);
  });
});

// browse all articles
router.get('/browse', (req, res) => {
  // articles is an array of json articles from sf
  const articles = [];

  // query salesforce for all articles
  conn.query('SELECT Id, Title__c, Author__c, Article__c, CreatedDate FROM CRKB_Entry__c', (err, result) => {
    if (err) { return console.error(err); }
    console.log(`total : ${result.totalSize}`);
    console.log(`fetched : ${result.records.length}`);

    // for each record from the query, add it to the articles json
    result.records.forEach((record) => {
      articles.push({
        id: record.Id,
        title: record.Title__c,
        author: record.Author__c,
        time: record.CreatedDate,
      });
    });

    // return the browse handlebars page and pass the articles json to be iterated by #each helper
    return res.render('browse', {
        // handlebars variable that stores the articles
      article: articles,
    }
    );
  });
});

module.exports = router;
