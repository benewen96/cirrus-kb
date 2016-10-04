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

// returns index handlebars page
router.get('/', (req, res) => res.render('index'));

// returns create handlebars page
router.get('/create', (req, res) => res.render('create'));


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

// browse all articles
router.get('/browse', (req, res) => res.render('browse'));

// get the article with the following id
router.get('/browse/:kbId', (req, res) => {
  let currentViews;
  // retrieve the entry from salesforce with the id from the url
  conn.sobject('CRKB_Entry__c').retrieve(req.params.kbId, (err, entry) => {
    if (err) { return console.error(err); }
    // returns the browseArticle handlebars page
    currentViews = entry.Views__c;
    console.log(`current: ${entry.Views__c}`);
    conn.sobject('CRKB_Entry__c').update({
      Id: req.params.kbId,
      Views__c: currentViews + 1,
    }, (err2, ret) => {
      if (err2 || !ret.success) { return console.error(err, ret); }
      console.log(`Updated Successfully : ${ret.id}`);
      return ret;
    });

    return res.render('browseArticle', {
      helpers: {
        // handlebars helper functions to retrieve the id and
        // (markdown rendered into html) content of an article
        article() { return new Handlebars.SafeString(md.render(entry.Article__c)); },
        rawArticle() { return new Handlebars.SafeString(entry.Article__c); },
        name() { return new Handlebars.SafeString(entry.Title__c); },
        author() { return new Handlebars.SafeString(entry.Author__c); },
        url() { return new Handlebars.SafeString(`https://eu11.salesforce.com/${entry.Id}`); },
        id() { return new Handlebars.SafeString(entry.Id); },
      },
    });
  });
});

// update the article
router.post('/update/:kbId', (req, res) => {
  conn.sobject('CRKB_Entry__c').update({
    Id: req.params.kbId,
    Title__c: req.body.title,
    Article__c: req.body.markdown,
    Author__c: req.body.author,
  }, (err, ret) => {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log(`Updated Successfully : ${ret.id}`);
    // return the success object back to ajax for id of record
    return res.send(ret);
  });
});

// edit page for an article
router.get('/update/:kbId', (req, res) => {
  // query salesforce for this article
  conn.sobject('CRKB_Entry__c').retrieve(req.params.kbId, (err, entry) => {
    if (err) { return console.error(err); }

    return res.render('update', {
      // handlebars helpers to return article info
      article() { return new Handlebars.SafeString(md.render(entry.Article__c)); },
      rawArticle() { return new Handlebars.SafeString(entry.Article__c); },
      name() { return new Handlebars.SafeString(entry.Title__c); },
      author() { return new Handlebars.SafeString(entry.Author__c); },
      url() { return new Handlebars.SafeString(`https://eu11.salesforce.com/${entry.Id}`); },
      id() { return new Handlebars.SafeString(entry.Id); },
    }
    );
  });
});

// this endpoint returns the entire kb in a json object
router.get('/json', (req, res) => {
  // articles is an array of json articles from sf

  const articles = [];
  const categories = {};
  // query salesforce for all articles
  conn.query('SELECT Id, Title__c, Author__c, Article__c, CreatedDate, Category__c FROM CRKB_Entry__c', (err, result) => {
    if (err) { return console.error(err); }
    console.log(`total : ${result.totalSize}`);
    console.log(`fetched : ${result.records.length}`);

    // for each record from the query, add it to the articles json
    result.records.forEach((record) => {
      // if the category has been specified
      if (record.Category__c !== null) {
        // if the record has multiple categories
        if (record.Category__c.includes(', ')) {
          // temp array to store split categories
          const arr = record.Category__c.split(', ');
          // for each of the multiple categories
          arr.forEach((cat) => {
            // if category doesnt exist yet
            if (!categories[cat]) {
              // create array at category address
              categories[cat] = [];
            }
            // push our record into the category
            categories[cat].push(record.Id);
          });
        // else there must be one category only
        } else {
          // if category doesnt exist yet
          if (!categories[record.Category__c]) {
            // create array at category address
            categories[record.Category__c] = [];
          }
          // push our record into the category
          categories[record.Category__c].push(record.Id);
        }
      }
      articles.push({
        id: record.Id,
        title: record.Title__c,
        author: record.Author__c,
        article: record.Article__c,
        category: record.Category__c,
        time: record.CreatedDate,
      });
    });
    // return the json object to whoever requested it
    // this is used in browse.js to get all the entries but could be used to export kb data

    const ret = {
      categories,
      articles,
    };
    return res.json(ret);
  });
});

// return list of contributors and how many articles they've wrote
router.get('/contributors', (req, res) => {
  // array of json for contributors
  const contributors = {};

  conn.query('SELECT Author__c FROM CRKB_Entry__c', (err, result) => {
    if (err) { return console.error(err); }
    console.log(`total : ${result.totalSize}`);
    console.log(`fetched : ${result.records.length}`);

    // for each record from the query, add it to the contributors json
    result.records.forEach((record) => {
      // if the author is newly discovered
      if (!contributors[record.Author__c]) {
        // initialise it
        contributors[record.Author__c] = 0;
      }
      // add 1 to their article count
      contributors[record.Author__c] += 1;
    });

    return res.json(contributors);
  });
});

// return list of top authors and how many articles they've wrote
router.get('/popular', (req, res) => {
  // array of json for popular contributors
  const pop = [];

// query salesforce for articles ordered by views return max 3 in desc order
  conn.query('SELECT Views__c, Title__c, Id , Author__c, Category__c FROM CRKB_Entry__c ORDER BY Views__c DESC NULLS LAST LIMIT 3', (err, result) => {
    if (err) { return console.error(err); }
    console.log(`total : ${result.totalSize}`);
    console.log(`fetched : ${result.records.length}`);

    // for each record from the query, add it to the pop json
    result.records.forEach((record) => {
      pop.push({
        title: record.Title__c,
        id: record.Id,
        author: record.Author__c,
        category: record.Category__c,
      });
    });

    return res.json(pop);
  });
});

// return list of top authors and how many articles they've wrote
router.get('/category/:cat', (req, res) => {
  const result = [];
  conn.query('SELECT Views__c, Title__c, Id , Author__c, Category__c FROM CRKB_Entry__c', (err, ret) => {
    if (err) { return console.error(err); }
    ret.records.forEach((record) => {
      if (record.Category__c === req.params.cat) {
        result.push({
          title: record.Title__c,
          id: record.Id,
          author: record.Author__c,
          category: record.Category__c,
        });
      }
    });
    return res.send(result);
  });
});

module.exports = router;
