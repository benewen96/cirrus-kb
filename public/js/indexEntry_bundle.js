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

	// this ajax request gets all the knowledge base articles from salesforce
	// see routes for /json for how
	$.ajax({
	  url: '/contributors', // This URL is for Json file
	  type: 'GET',
	  dataType: 'json',
	  // get returns all entries from kb
	  success: function success(data) {
	    console.log(data);
	    for (var cont in data) {
	      if ({}.hasOwnProperty.call(data, cont)) {
	        $('#contributors').append('<tr>\n          <td>' + cont + '</td>\n          <td>' + data[cont] + '</td>\n        </tr>');
	      }
	    }
	    $('#top_cont').DataTable({
	      order: [1, 'desc'],
	      sDom: ''
	    });
	  },
	  error: function error() {
	    // hopefully nothing here :)
	  }
	});

	$.ajax({
	  url: '/popular', // This URL is for Json file
	  type: 'GET',
	  dataType: 'json',

	  success: function success(data) {
	    console.log(data);
	    data.forEach(function (article) {
	      $('#popular_articles').append('<a href="/browse/' + article.id + '" class="list-group-item">\n      <h4 class="list-group-item-heading">' + article.title + '</h4>\n      <p class="list-group-item-text">By ' + article.author + '</p>\n      </a>');
	    });
	  },
	  error: function error() {
	    // hopefully nothing here :)
	  }
	});

/***/ }
/******/ ]);