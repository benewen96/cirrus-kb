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

	$('#salesforce').on('click', function () {
	  window.open('{{url}}');
	});

	$('#edit').on('click', function () {
	  $('#edit').hide();
	  $('#article').empty();
	  $('#article').removeAttr('class');

	  $('#article').html('<div class=\'row\'>\n\t\t<div class="col-md-6" style=\'padding-bottom:20px\'>\n      <input type="text"  id=\'article_title\' class="form-control" value=\'{{name}}\'>\n    </div>\n\t\t<div class="col-md-6" style=\'padding-bottom:20px\'>\n      <input type="text"  id=\'author\' class="form-control" value="{{author}}">\n    </div>\n  </div>\n\n\n\t\t<!--Text area for markdown editor -->\n\t\t<textarea id=\'mdeditor\'></textarea>\n\n\n\t\t<div class=\'\' style=\'width:20%;float:right;\'>\n\t\t\t<!--Save button -->\n\t\t\t<button id=\'save\' type="button" class="btn btn-normal btn-block">Save</button>\n\t\t</div>\n  ');
	  // create a new markdown editor
	  var simplemde = new SimpleMDE({
	    element: $('#mdeditor')[0],
	    autosave: {
	      enabled: false
	    }
	  });
	  console.log();
	  simplemde.value('{{rawArticle}}');
	});

/***/ }
/******/ ]);