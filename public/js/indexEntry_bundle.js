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

	// this ajax request gets all the top contributors to the kb from salesforce
	// see routes for /contributors for how
	$.ajax({
	  url: '/contributors',
	  type: 'GET',
	  dataType: 'json',
	  // get returns top contributors
	  success: function success(data) {
	    // for each contributor...
	    for (var cont in data) {
	      // for in safe-guard
	      if ({}.hasOwnProperty.call(data, cont)) {
	        // append the list of contributors
	        $('#contributors').append('<tr>\n          <td>' + cont + '</td>\n          <td>' + data[cont] + '</td>\n        </tr>');
	      }
	    }
	    // Now we have ajax, init datatable, sort by contributions
	    $('#top_cont').DataTable({
	      order: [1, 'desc'],
	      sDom: ''
	    });
	  },
	  error: function error() {
	    // hopefully nothing here :)
	  }
	});

	// this ajax request gets the most popular articles in the kb from salesforce
	// see routes for /popular for how
	$.ajax({
	  url: '/popular',
	  type: 'GET',
	  dataType: 'json',

	  success: function success(data) {
	    // data is the popular articles
	    // for each popular article...
	    data.forEach(function (article) {
	      // append the list of popular articles
	      $('#popular_articles').append('<a href="/browse/' + article.id + '" class="list-group-item">\n      <h4 class="list-group-item-heading">' + article.title + '</h4>\n      <p class="list-group-item-text">By ' + article.author + '</p>\n      </a>');
	    });
	  },
	  error: function error() {
	    // hopefully nothing here :)
	  }
	});

/***/ }
/******/ ]);