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
	  this.field('category', { boost: 7 });
	  this.field('author');
	  this.field('article');
	  this.ref('id');
	});

	var store = {};

	// *** PRELOADER ***
	var loadingStatus = 0;
	$(document).ajaxStart(function () {}).ajaxStop(function () {
	  $('#loadingbar').attr('style', 'width: 100%');
	  $('#loading').slideUp(600, function () {});
	}).ajaxComplete(function () {
	  loadingStatus += 20;
	  $('[id$=_articles]').fadeIn('slow');
	  $('#loadingbar').attr('style', 'width: ' + loadingStatus + '%');
	});
	//* * END **/

	getKnowledgeBase();

	function renderCategories(categories) {
	  $('#article_list').empty();

	  var _loop = function _loop(category) {
	    $('#article_list').append('\n     <div class="panel panel-default">\n       <div class="panel-heading">' + category + '</div>\n       <div class="list-group" id=\'' + category + '_articles\'>\n       </div>\n     </div>\n     ');
	    categories[category].forEach(function (articleId) {
	      $('#' + category + '_articles').append('<a href="/browse/' + store[articleId].id + '" class="list-group-item">\n             <h4 class="list-group-item-heading">' + store[articleId].title + '</h4>\n             <p class="list-group-item-text">By ' + store[articleId].author + '</p>\n             <p class="list-group-item-text"><i>' + store[articleId].category + '</i></p>\n           </a>');
	      $('#' + store[articleId].category + '_articles').hide();
	    });
	  };

	  for (var category in categories) {
	    _loop(category);
	  }
	}

	function getKnowledgeBase() {
	  $.ajax({
	    url: '/json',
	    type: 'GET',
	    dataType: 'json',

	    success: function success(data) {
	      // for each kb entry
	      data.articles.forEach(function (entry) {
	        // add each entry into the lunr engine for tokenisation and indexing
	        articles.add({
	          id: entry.id,
	          title: entry.title,
	          author: entry.author,
	          article: entry.article,
	          category: entry.category
	        });
	        // to be able to get O(1) lookup, add each entry to store object with id
	        // means if we know id from lunr, can go store[id] to get entry instantly
	        store[entry.id] = {
	          id: entry.id,
	          title: entry.title,
	          author: entry.author,
	          article: entry.article,
	          time: entry.time,
	          category: entry.category
	        };
	      });
	      renderCategories(data.categories);
	    },
	    error: function error() {
	      // hopefully nothing here :)
	    }
	  });
	}

	function rerender() {
	  $('#article_list').empty();
	  // data is the popular articles
	  // for each popular article...


	  // lunr will search all articles for the current search value
	  var res = articles.search($('#searchfield').val());
	  // for each search result
	  res.forEach(function (result) {
	    // append the article list with each entry
	    $('#article_list').append('<a id="' + store[result.ref].id + '"href="/browse/' + store[result.ref].id + '" class="list-group-item">\n    <h4 class="list-group-item-heading">' + store[result.ref].title + '</h4>\n    <p class="list-group-item-text"><i>' + store[result.ref].category + '</i></p>\n    <p class="list-group-item-text">By ' + store[result.ref].author + '</p>\n    </a>');
	  });
	}

	// if the search fields input changes (i.e. someone typed in it)
	$('#searchfield').on('keyup', function () {
	  if ($('#searchfield').val() === '') {
	    renderCategories();
	  } else {
	    rerender();
	  }
	});

/***/ }
/******/ ]);