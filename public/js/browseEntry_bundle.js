/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	// tell lunr our data model
	var articles = lunr(function construct() {
	  this.field('title', { boost: 10 });
	  this.field('author');
	  this.field('article');
	  this.ref('id');
	});

	// store is a key value storage to get articles in O(1) time
	var store = {};

	// if the search fields input changes (i.e. someone typed in it)
	$('#searchfield').on('keyup change', function () {
	  // if the value is empty, clear and show the original list
	  if ($('#searchfield').val() === '') {
	    $('#article_list').empty();
	    // for...in lets us iterate over an enumerable property
	    // this is because store isn't an array (due to wanting to access in O(1))
	    for (var article in store) {
	      // for in guard
	      if ({}.hasOwnProperty.call(store, article)) {
	        // append the article list with each entry
	        $('#article_list').append('<a href="/browse/' + store[article].id + '" class="list-group-item">\n          <h4 class="list-group-item-heading">' + store[article].title + '</h4>\n          <p class="list-group-item-text">By ' + store[article].author + '</p>\n          </a>');
	      }
	    }
	  } else {
	    $('#article_list').empty();
	    // lunr will search all articles for the current search value
	    var res = articles.search($('#searchfield').val());
	    // for each search result
	    res.forEach(function (result) {
	      // append the article list with each entry
	      $('#article_list').append('<a href="/browse/' + store[result.ref].id + '" class="list-group-item">\n        <h4 class="list-group-item-heading">' + store[result.ref].title + '</h4>\n        <p class="list-group-item-text">By ' + store[result.ref].author + '</p>\n        </a>');
	    });
	  }
	});

	// this ajax request gets all the knowledge base articles from salesforce
	// see routes for /json for how
	$.ajax({
	  url: '/json', // This URL is for Json file
	  type: 'GET',
	  dataType: 'json',
	  // get returns all entries from kb
	  success: function success(data) {
	    // for each kb entry
	    data.forEach(function (entry) {
	      // add each entry into the lunr engine for tokenisation and indexing
	      articles.add({
	        id: entry.id,
	        title: entry.title,
	        author: entry.author,
	        article: entry.article
	      });
	      // to be able to get O(1) lookup, add each entry to store object with id
	      // means if we know id from lunr, can go store[id] to get entry instantly
	      store[entry.id] = {
	        id: entry.id,
	        title: entry.title,
	        author: entry.author,
	        article: entry.article,
	        time: entry.time
	      };
	    });
	  },
	  error: function error() {
	    // hopefully nothing here :)
	  }
	});

/***/ }
/******/ ]);