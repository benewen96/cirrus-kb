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

	// create a new markdown editor
	var simplemde = new SimpleMDE({
	  element: $('#mdeditor')[0],
	  autosave: {
	    enabled: false
	  }
	});

	// called when user hits save button
	var save = function save() {
	  // get markdown from editor
	  var markdown = simplemde.value();
	  // wrap user input into json
	  var jsonData = {
	    markdown: markdown,
	    author: $('#author').val(),
	    title: $('#article_title').val()
	  };
	  // make sure we had some markdown to add
	  if (markdown) {
	    // update save button and disable it until user edits
	    $('#save').text('Thanks!');
	    $('#save').attr('class', 'btn btn-success btn-block disabled');
	    // send ajax request to /create see routes for more info
	    $.ajax({
	      // our endpoint in routes for creating a new record
	      url: '/create',
	      type: 'POST',
	      // data is a JSON object that will contain our markdown
	      data: jsonData,
	      // post request returns success object from jsforce that contains id of record
	      success: function success(data) {
	        // now we know record id, redirect user to their article
	        window.location.replace('/browse/' + data.id);
	      },
	      error: function error(data) {
	        // hopefully nothing here :)
	        console.log(data);
	      }
	    });
	  }
	};

	$(document).ready(function () {
	  $('#salesforce').on('click', function () {
	    window.open($('#url').text());
	  });

	  // if the markdown has been edited, allow the user to save
	  simplemde.codemirror.on('change', function () {
	    $('#save').text('Save');
	    $('#save').attr('class', 'btn btn-success btn-block');
	  });
	  // save event listener
	  $('#save').click(function () {
	    save();
	  });
	});

/***/ }
/******/ ]);