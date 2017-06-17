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
/***/ (function(module, exports) {

	// vim:sw=2:ts=2:sts=2:
	import SetPasswordControl from "./components/SetPasswordControl";
	import DateRangeControl from "./components/DateRangeControl";
	import SingleDayControl from "./components/SingleDayControl";
	import CRUDCreateButton from "./components/CRUDCreateButton";
	import CRUDEditButton from "./components/CRUDEditButton";
	import CRUDDeleteButton from "./components/CRUDDeleteButton";
	import CRUDEditDeleteButtonGroup from "./components/CRUDEditDeleteButtonGroup";
	import CRUDListEditor from "./components/CRUDListEditor";
	import CRUDHasManyEditor from "./components/CRUDHasManyEditor";
	import CRUDRelModal from "./CRUDRelModal";
	import TableViewBuilder from "./viewbuilder/TableViewBuilder";

	window.SetPasswordControl = SetPasswordControl;
	window.DateRangeControl = DateRangeControl;
	window.SingleDayControl = SingleDayControl;
	window.CRUDCreateButton = CRUDCreateButton;
	window.CRUDEditButton = CRUDEditButton;
	window.CRUDDeleteButton = CRUDDeleteButton;
	window.CRUDEditDeleteButtonGroup = CRUDEditDeleteButtonGroup;
	window.CRUDListEditor = CRUDListEditor;
	window.CRUDHasManyEditor = CRUDHasManyEditor;
	window.CRUDRelModal = CRUDRelModal;
	window.TableViewBuilder = TableViewBuilder;

	import { initCRUDVendorComponents, initCRUDComponents, initCRUDModalAction } from "./init";

	window.initCRUDComponents = initCRUDComponents;
	window.initCRUDVendorComponents = initCRUDVendorComponents;
	window.initCRUDModalAction = initCRUDModalAction;

	// backward compatibility for older React
	// might be able to be removed.
	if (typeof ReactDOM === "undefined") {
	  ReactDOM = { render: React.render.bind(React) };
	}

	function loadRegions($body) {
	  $body.find('[data-region]').each(function (i, el) {
	    console.log("found region", el, el.dataset.region, el.dataset.args, el.dataset);
	    const path = el.dataset.region;
	    if (path) {
	      Region.load($(el), path, el.dataset.args || {});
	    }
	  });
	}

	// Unmount app manually when region is going to fetch new contents.
	$(Region).bind('region.unmount', function (e, $region) {
	  $region.find('.react-app').each(function () {
	    const unmount = React.unmountComponentAtNode(this);
	  });
	});

	$(Region).bind('region.load', function (e, $region) {
	  console.debug('region.load');
	  initCRUDComponents($region);
	  initCRUDVendorComponents($region);
	  loadRegions($region);
	});

	$(function () {
	  if (typeof FormKit === 'undefined') {
	    console.warn('FormKit is not loaded.');
	  } else {
	    FormKit.install();
	  }

	  console.debug('crudapp ready');
	  initCRUDComponents($(document.body));
	  initCRUDVendorComponents($(document.body));

	  $(document).bind('drop dragover', function (e) {
	    e.preventDefault();
	  });

	  loadRegions($(document.body));
	});

/***/ })
/******/ ]);