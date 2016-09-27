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

	/*
	  eslint-env browser
	  exported save
	*/

	var simplemde = new SimpleMDE({
	  element: $('#mdeditor')[0],
	  autosave: {
	    enabled: false
	  }
	});

	var save = function save() {
	  var markdown = simplemde.value();
	  var jsonData = {
	    markdown: markdown,
	    author: $('#author').val(),
	    title: $('#article_title').val(),
	    tags: $('#tags').val()
	  };

	  if (markdown) {
	    $('#save').text('Thanks!');
	    $('#save').attr('class', 'btn btn-success btn-block disabled');
	    $.ajax({
	      // our endpoint in routes for creating a new record
	      url: '/create',
	      type: 'POST',
	      // data is a JSON object that will contain our markdown
	      data: jsonData,
	      success: function success(data) {
	        window.location.replace('/browse/' + data.id);
	      },
	      error: function error(data) {
	        console.log(data);
	      }
	    });
	  }
	};

	$(document).ready(function () {
	  simplemde.codemirror.on('change', function () {
	    $('#save').text('Save');
	    $('#save').attr('class', 'btn btn-normal btn-block');
	  });
	  // save event listener
	  $('#save').click(function () {
	    save();
	  });
	});

/***/ }
/******/ ]);