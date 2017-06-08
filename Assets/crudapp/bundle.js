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
/***/ function(module, exports, __webpack_require__) {

	// vim:sw=2:ts=2:sts=2:
	"use strict";

	var _init = __webpack_require__(1);

	window.SetPasswordControl = __webpack_require__(2);
	window.DateRangeControl = __webpack_require__(4);
	window.SingleDayControl = __webpack_require__(5);
	window.CRUDCreateButton = __webpack_require__(6);
	window.CRUDEditButton = __webpack_require__(8);
	window.CRUDDeleteButton = __webpack_require__(9);
	window.CRUDListEditor = __webpack_require__(10);
	window.CRUDHasManyEditor = __webpack_require__(30);
	window.CRUDRelModal = __webpack_require__(7);
	window.TableViewBuilder = __webpack_require__(41);

	window.initCRUDComponents = _init.initCRUDComponents;
	window.initCRUDVendorComponents = _init.initCRUDVendorComponents;
	window.initCRUDModalAction = _init.initCRUDModalAction;

	// backward compatibility for older React
	// might be able to be removed.
	if (typeof ReactDOM === "undefined") {
	  ReactDOM = { render: React.render.bind(React) };
	}

	// Unmount app manually when region is going to fetch new contents.
	$(Region).bind('region.unmount', function (e, $region) {
	  $region.find('.react-app').each(function () {
	    var unmount = React.unmountComponentAtNode(this);
	  });
	});

	$(Region).bind('region.load', function (e, $region) {
	  console.debug('region.load');
	  (0, _init.initCRUDComponents)($region);
	  (0, _init.initCRUDVendorComponents)($region);
	});

	$(function () {
	  if (typeof FormKit === 'undefined') {
	    console.warn('FormKit is not loaded.');
	  } else {
	    FormKit.install();
	  }

	  console.debug('crudapp ready');
	  (0, _init.initCRUDComponents)($(document.body));
	  // initCRUDVendorComponents();

	  $(document).bind('drop dragover', function (e) {
	    e.preventDefault();
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	// vim:sw=2:ts=2:sts=2:

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.initCRUDVendorComponents = initCRUDVendorComponents;
	exports.initCRUDComponents = initCRUDComponents;
	exports.initCRUDModalAction = initCRUDModalAction;
	function convertDOMStringMapToObject(map) {
	  var obj = {};
	  for (var key in map) {
	    obj[key] = map[key];
	  }
	  return obj;
	}

	function initMaterialDesign($region) {
	  // for block styled checkbox, material doesn't work for inline checkbox
	  if (typeof $.material !== "undefined") {
	    $.material.checkbox($region.find('.checkbox > label > input[type=checkbox]'));
	  }
	}

	function initOembed($region) {
	  if (typeof jQuery.oembed === 'undefined') {
	    return;
	  }
	  $region.find('.oembed').oembed(null, { maxHeight: 160, maxWidth: 300 });
	}

	function initHolderJs($region) {
	  if (typeof Holder !== "undefined") {
	    Holder.run({
	      domain: 'crud.list'
	    });
	  }
	}

	function initFacebox($region) {
	  if (typeof jQuery.fn.facebox !== "undefined") {
	    $region.find('a[rel*=facebox]').facebox({
	      closeImage: '/assets/facebox/src/closelabel.png',
	      loadingImage: '/assets/facebox/src/loading.gif'
	    });
	  }
	}

	function initFormKit($region) {
	  if (typeof FormKit === "undefined") {
	    console.warn("FormKit is not loaded, please load 'formkit' asset.");
	    return;
	  }
	  FormKit.initialize($region);
	}

	function initCRUDDeleteButton($region) {
	  var elements = $region.find('.crud-delete-button');
	  elements.each(function (i, el) {
	    var obj = convertDOMStringMapToObject(el.dataset);
	    obj.region = $region;

	    var btn = React.createElement(CRUDDeleteButton, obj);
	    ReactDOM.render(btn, el);
	  });
	}

	function initCRUDEditButton($region) {
	  var elements = $region.find('.crud-edit-button');
	  elements.each(function (i, el) {
	    var obj = convertDOMStringMapToObject(el.dataset);
	    obj.region = $region;

	    var btn = React.createElement(CRUDEditButton, obj);
	    ReactDOM.render(btn, el);
	  });
	}

	function initCRUDCreateButton($region) {
	  var elements = $region.find('.crud-create-button');
	  elements.each(function (i, el) {
	    console.debug('crud-create-button', i, el, el.dataset);

	    var obj = convertDOMStringMapToObject(el.dataset);
	    obj.region = $region;

	    var btn = React.createElement(CRUDCreateButton, obj);
	    ReactDOM.render(btn, el);
	  });
	}

	function initCRUDPasswordControl($region) {
	  var elements = $region.find('.crud-password-control');
	  elements.each(function (i, el) {
	    console.debug('crud-password-control', i, el, el.dataset);
	    var control = React.createElement(SetPasswordControl, {
	      "required": elem.dataset["required"],
	      "type": elem.dataset["type"]
	    });
	    ReactDOM.render(control, el);
	  });
	}

	function initDatePicker($region) {
	  if (typeof jQuery.fn.datepicker === "undefined") {
	    console.warn("jQuery.datepicker is not loaded");
	    return;
	  }
	  $region.find('.date-picker').datepicker({ dateFormat: 'yy-mm-dd' });
	}

	function initTabs($region) {

	  // bootstrap tabs
	  if (typeof jQuery.fn.tab !== "undefined") {
	    $region.find('.nav-tabs li:first-child a[data-toggle="tab"]').tab('show');
	  }

	  // jQuery tabs plugin
	  if (typeof jQuery.fn.tabs !== "undefined") {
	    $region.find('.tabs').tabs();
	  }
	}

	function initCollapsible($region) {
	  if (typeof jQuery.fn.collapse === "undefined") {
	    console.warn("jQuery.collapse is not loaded");
	    return;
	  }
	  $region.find(".collapsible").collapse();
	}

	function initAccordion($region) {
	  if (typeof jQuery.fn.accordion === "undefined") {
	    console.warn("jQuery.accordion is not loaded");
	    return;
	  }

	  // initialize accordion
	  $region.find('.accordion').accordion({
	    active: false,
	    collapsible: true,
	    autoHeight: false
	  });
	}

	function initBundleI18NPlugin($region) {
	  if (typeof I18N === "undefined") {
	    console.warn('I18N plugin is not loaded.');
	    return;
	  }

	  // Initialize language section switch
	  // Add lang-switch class name to lang select dropdown to initialize lang
	  // switch feature
	  $region.find('select[name=lang]').addClass('lang-switch');
	  I18N.initLangSwitch($region);
	}

	function initFieldHint($region) {
	  $region.find(".v-field .hint").each(function (i, e) {
	    var $hint = $(this);
	    $hint.hide().css({ position: "absolute", zIndex: 100 });
	    $hint.parent().css({ position: "relative" });
	    $hint.prev().hover(function () {
	      $hint.fadeIn();
	    }, function () {
	      $hint.fadeOut();
	    });
	  });
	}

	function initColorBox($region) {
	  if (typeof jQuery.fn.colorbox === "undefined") {
	    console.warn('jquery.colorbox is not loaded.');
	    return;
	  }

	  $region.find('.colorbox-inline').colorbox({
	    inline: true,
	    width: "50%",
	    fixed: true,
	    opacity: '0.5'
	  });

	  $region.find('.btn-close-colorbox').on('click', function (e) {
	    e.preventDefault();
	    $.fn.colorbox.close();
	  });
	}

	function initCRUDVendorComponents($region) {
	  // init extra vendor components
	  initFormKit($region);
	  initOembed($region);
	  initFacebox($region);
	  initHolderJs($region);
	  initMaterialDesign($region);
	  initDatePicker($region);
	  initCollapsible($region);
	  initColorBox($region);

	  if (typeof use_tinymce !== "undefined") {
	    use_tinymce('adv1', { popup: true });
	  }
	}

	;

	function initCRUDComponents($region) {

	  // init core components
	  initCRUDPasswordControl($region);
	  initCRUDCreateButton($region);
	  initCRUDEditButton($region);
	  initCRUDDeleteButton($region);

	  // init bundle plugins
	  initBundleI18NPlugin($region);
	  initFieldHint($region);
	}

	;

	function initCRUDModalAction(currentFormId) {
	  var formEl = document.getElementById(currentFormId);

	  console.debug('setting up form validation for ', formEl);

	  var highlighter = new ActionBootstrapHighlight(formEl);
	  var $form = $(formEl);
	  var $msgbox = $form.prev('.action-result-container').first();
	  var a = Action.form(formEl, {
	    'clear': false,
	    'onSubmit': function onSubmit() {
	      highlighter.cleanup();
	    },
	    'onSuccess': function onSuccess(resp) {
	      jQuery.scrollTo(formEl, 600, { offset: -200 });
	      // TODO: redirect?
	    },
	    'onError': function onError(resp) {
	      highlighter.fromValidations(resp.validations);
	      if (typeof jQuery.scrollTo != "undefined") {
	        var input = highlighter.getFirstInvalidField();
	        if (input) {
	          jQuery.scrollTo(input, 600, { offset: -200 });
	        } else {
	          jQuery.scrollTo($msgbox.get(0), 600, { offset: -200 });
	        }
	      }
	    }
	  });
	  a.plug(ActionMsgbox, {
	    'disableScroll': true,
	    'container': $msgbox
	  });
	}

	;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var React = __webpack_require__(3);
	exports["default"] = React.createClass({
	    displayName: "SetPasswordControl",

	    propType: {
	        "type": React.PropTypes.string.isRequired
	    },

	    getInitialState: function getInitialState() {
	        return {
	            // type can be "email" or "manual"
	            "type": this.props.type || "email"
	        };
	    },

	    handleTypeChange: function handleTypeChange(e) {
	        this.setState({
	            "type": e.target.value
	        });
	    },

	    render: function render() {
	        return React.createElement(
	            "div",
	            { className: "form-group" },
	            React.createElement(
	                "label",
	                { htmlFor: "inputPassword", className: "col-lg-2 control-label" },
	                "新密碼"
	            ),
	            React.createElement(
	                "div",
	                { className: "col-lg-10" },
	                React.createElement(
	                    "div",
	                    { className: "radio radio-primary", style: this.props.required ? { "display": "none" } : {} },
	                    React.createElement(
	                        "label",
	                        null,
	                        React.createElement("input", { type: "radio", name: "set_password", value: "none", onClick: this.handleTypeChange, defaultChecked: this.state.type == "none" ? "checked" : "" }),
	                        React.createElement("span", { className: "circle" }),
	                        React.createElement("span", { className: "check" }),
	                        React.createElement(
	                            "div",
	                            null,
	                            "保留"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "radio radio-primary" },
	                    React.createElement(
	                        "label",
	                        null,
	                        React.createElement("input", { type: "radio", name: "set_password", value: "email", onClick: this.handleTypeChange, defaultChecked: this.state.type == "email" ? "checked" : "" }),
	                        React.createElement("span", { className: "circle" }),
	                        React.createElement("span", { className: "check" }),
	                        React.createElement(
	                            "div",
	                            null,
	                            "新密碼自動產生並用 E-mail 發送給使用者"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "radio radio-primary" },
	                    React.createElement(
	                        "label",
	                        null,
	                        React.createElement("input", { type: "radio", name: "set_password", value: "manual", onClick: this.handleTypeChange }),
	                        React.createElement("span", { className: "circle" }),
	                        React.createElement("span", { className: "check" }),
	                        React.createElement(
	                            "div",
	                            null,
	                            "自行更改密碼"
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { style: this.state.type != "manual" ? { opacity: 0.3 } : {} },
	                    React.createElement(
	                        "div",
	                        { className: "col-lg-12 clearfix" },
	                        React.createElement(
	                            "label",
	                            { htmlFor: "inputPassword", className: "control-label pull-left" },
	                            "請輸入新密碼"
	                        ),
	                        React.createElement("input", { id: "inputPassword",
	                            type: "password",
	                            disabled: this.state.type == "email" || this.state.type == "none" ? "disabled" : "",
	                            name: "password",
	                            placeholder: "*********",
	                            className: "form-control" })
	                    ),
	                    React.createElement(
	                        "div",
	                        { className: "col-lg-12 clearfix" },
	                        React.createElement(
	                            "label",
	                            { htmlFor: "inputPasswordConfirm", className: "control-label pull-left" },
	                            "再次輸入新密碼"
	                        ),
	                        React.createElement("input", { id: "inputPasswordConfirm",
	                            type: "password",
	                            disabled: this.state.type == "email" || this.state.type == "none" ? "disabled" : "",
	                            name: "password_confirm",
	                            placeholder: "*********",
	                            className: "form-control" })
	                    )
	                )
	            )
	        );
	    }
	});
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var React = __webpack_require__(3);
	exports['default'] = React.createClass({
	  displayName: 'DateRangeControl',

	  getInitialState: function getInitialState() {
	    // get from from cookie
	    var rangeType = this.props.rangeType || jQuery.cookie("dateRangeType") || 'recent7day';
	    var from = this.props.from || jQuery.cookie("dateRangeFrom");
	    var to = this.props.to || jQuery.cookie("dateRangeTo");
	    return {
	      "rangeType": rangeType,
	      "from": from,
	      "to": to
	    };
	  },

	  handleStartDateChange: function handleStartDateChange(e, datestr) {
	    if (!datestr) {
	      var input = ReactDOM.findDOMNode(this.refs.fromDateInput);
	      datestr = input.value;
	    }
	    jQuery.cookie("dateRangeFrom", datestr);
	    this.setState({ "from": datestr });
	  },

	  handleEndDateChange: function handleEndDateChange(e, datestr) {
	    if (!datestr) {
	      var input = ReactDOM.findDOMNode(this.refs.toDateInput);
	      datestr = input.value;
	    }
	    jQuery.cookie("dateRangeTo", datestr);
	    this.setState({ "to": datestr });
	  },

	  handleRangeTypeChange: function handleRangeTypeChange(e) {
	    // update cookie
	    jQuery.cookie("dateRangeType", e.target.value);
	    this.setState({
	      "rangeType": e.target.value
	    });
	  },

	  initDatePicker: function initDatePicker() {
	    var that = this;
	    if (this.state.rangeType == 'custom') {
	      var from = ReactDOM.findDOMNode(this.refs.fromDateInput);
	      var to = ReactDOM.findDOMNode(this.refs.toDateInput);

	      $(from).datepicker({
	        dateFormat: 'yy/mm/dd',
	        changeMonth: true,
	        changeYear: true,
	        maxDate: '0',
	        onSelect: function onSelect(datestr, ui) {
	          that.handleStartDateChange(null, datestr);
	        }
	      });
	      $(to).datepicker({
	        dateFormat: 'yy/mm/dd',
	        changeMonth: true,
	        changeYear: true,
	        maxDate: '0',
	        onSelect: function onSelect(datestr, ui) {
	          that.handleEndDateChange(null, datestr);
	        }
	      });
	    }
	  },
	  componentDidMount: function componentDidMount(e) {
	    this.initDatePicker();
	  },
	  componentDidUpdate: function componentDidUpdate(e) {
	    this.initDatePicker();
	  },
	  render: function render() {

	    /*
	    for (var i = 0 ; i < options.length ; i++) {
	        if (options[i].value == this.props.rangeType) {
	            options[i].selected = true;
	        }
	    }
	    */

	    var dateFrom = [];

	    if (this.props.allowPeriodColumnOption) {
	      dateFrom.push(React.createElement(
	        'span',
	        { key: 'period-column' },
	        React.createElement(
	          'select',
	          { ref: 'periodColumnType', id: 'period-column',
	            name: 'period-column',
	            className: 'form-control',
	            defaultValue: this.props.allowPeriodColumnOption || "sale_period_at" },
	          React.createElement(
	            'option',
	            { value: 'sale_period_at' },
	            '營業日'
	          ),
	          React.createElement(
	            'option',
	            { value: 'transaction_created_at' },
	            '交易日'
	          )
	        )
	      ));
	    }

	    var options = [];
	    // options.push(<option value={'recent30day'}>最近 30 天</option>);
	    options.push(React.createElement(
	      'option',
	      { key: 'recent7day', value: 'recent7day' },
	      '最近 7 天'
	    ));
	    options.push(React.createElement(
	      'option',
	      { key: 'recent1month', value: 'recent1month' },
	      '最近 1 個月'
	    ));
	    options.push(React.createElement(
	      'option',
	      { key: 'day', value: 'day' },
	      '單日'
	    ));
	    options.push(React.createElement(
	      'option',
	      { key: 'custom', value: 'custom' },
	      '自訂'
	    ));
	    dateFrom.push(React.createElement(
	      'select',
	      { key: 'date-range-type', id: 'date-range-type', name: 'date-range-type', className: 'form-control',
	        defaultValue: this.state.rangeType,
	        onChange: this.handleRangeTypeChange },
	      options
	    ));

	    if (this.state.rangeType == 'custom') {
	      dateFrom.push(React.createElement(
	        'span',
	        { key: 'custom-date-range' },
	        React.createElement(
	          'label',
	          { htmlFor: 'date-range-from' },
	          '起日'
	        ),
	        React.createElement('input', { ref: 'fromDateInput', id: 'date-range-from',
	          name: 'date-range-from',
	          className: 'form-control datepicker',
	          size: 12,
	          defaultValue: this.state.from, onChange: this.handleStartDateChange }),
	        React.createElement(
	          'label',
	          { htmlFor: 'date-range-to' },
	          '迄日'
	        ),
	        React.createElement('input', { ref: 'toDateInput', id: 'date-range-to',
	          name: 'date-range-to',
	          className: 'form-control datepicker',
	          size: 12,
	          defaultValue: this.state.to, onChange: this.handleEndDateChange })
	      ));
	    } else if (this.state.rangeType == 'day') {
	      dateFrom.push(React.createElement(
	        'span',
	        { key: 'custom-date-single' },
	        React.createElement(
	          'label',
	          { htmlFor: 'date-range-from' },
	          '日期'
	        ),
	        React.createElement('input', { ref: 'fromDateInput', id: 'date-range-from',
	          name: 'date-range-from', className: 'form-control datepicker',
	          size: 12,
	          defaultValue: this.state.from, onChange: this.handleStartDateChange })
	      ));
	    }

	    return React.createElement(
	      'div',
	      null,
	      dateFrom
	    );
	  }
	});
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(3);
	exports["default"] = React.createClass({
	  displayName: "SingleDayControl",

	  getInitialState: function getInitialState() {
	    return {
	      "from": this.props.from || jQuery.cookie("dateRangeFrom") || new Date().toJSON().slice(0, 10)
	    };
	  },

	  handleStartDateChange: function handleStartDateChange(e, datestr) {
	    if (!datestr) {
	      var input = ReactDOM.findDOMNode(this.refs.fromDateInput);
	      datestr = input.value;
	    }
	    jQuery.cookie("dateRangeFrom", datestr);
	    this.setState({ "from": datestr });
	  },

	  initDatePicker: function initDatePicker() {
	    var that = this;
	    var from = ReactDOM.findDOMNode(this.refs.fromDateInput);
	    jQuery(from).datepicker({
	      dateFormat: 'yy/mm/dd',
	      changeMonth: true,
	      changeYear: true,
	      maxDate: '0',
	      onSelect: function onSelect(datestr, ui) {
	        that.handleStartDateChange(null, datestr);
	      }
	    });
	  },
	  componentDidMount: function componentDidMount(e) {
	    this.initDatePicker();
	  },
	  componentDidUpdate: function componentDidUpdate(e) {
	    this.initDatePicker();
	  },
	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement("input", { type: "hidden", id: "date-range-type", name: "date-range-type", value: "day" }),
	      React.createElement(
	        "label",
	        { htmlFor: "start-at" },
	        "營業日"
	      ),
	      React.createElement("input", { id: "start-at", name: "start-at",
	        ref: "fromDateInput", className: "form-control datepicker",
	        size: 12,
	        onChange: this.handleStartDateChange,
	        defaultValue: this.state.from })
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _CRUDRelModal = __webpack_require__(7);

	var _CRUDRelModal2 = _interopRequireDefault(_CRUDRelModal);

	/*
	<CRUDCreateButton 
	    label="Create"
	    size="large"
	    side=false
	    baseUrl=/bs/user
	>
	</CRUDCreateButton>



	<CRUDCreateButton 
	    modelLabel="Create"
	    size="large"
	    side=false
	    baseUrl=/bs/user
	>
	</CRUDCreateButton>


	*/
	exports["default"] = _react2["default"].createClass({
	    displayName: "CRUDCreateButton",

	    propTypes: {
	        /**
	         * label of the button
	         */
	        "label": _react2["default"].PropTypes.string,

	        /*
	         * the baseUrl of a CRUD handler, usually "/bs"
	         */
	        "baseUrl": _react2["default"].PropTypes.string,

	        "region": _react2["default"].PropTypes.any,

	        /**
	         * The parent record key is used for creating a new record belongs to the parent.
	         */
	        "parentRecordKey": _react2["default"].PropTypes.any,

	        // modal related options
	        // ==============================
	        /**
	         * the modal size: it could be "large", "small"
	         */
	        "size": _react2["default"].PropTypes.string,

	        /**
	         * show the modal as a side modal?
	         */
	        "side": _react2["default"].PropTypes.bool,

	        /**
	         * the title of the modal
	         */
	        "title": _react2["default"].PropTypes.string,

	        "onInit": _react2["default"].PropTypes.func,

	        "onSuccess": _react2["default"].PropTypes.func
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {};
	    },

	    getInitialState: function getInitialState() {
	        return {};
	    },

	    componentDidMount: function componentDidMount() {},

	    componentWillUnmount: function componentWillUnmount() {},

	    handleClick: function handleClick(e) {
	        var _this = this;

	        e.stopPropagation();

	        var args = {};

	        if (this.props.parentRecordKey) {
	            args['parent-key'] = this.props.parentRecordKey;
	        }

	        _CRUDRelModal2["default"].open(this.props.title || this.props.label || 'Untitled', this.props.baseUrl + "/crud/create", args, {
	            "size": this.props.size || "large",
	            "side": this.props.side || false,
	            "closeOnSuccess": true,
	            "init": this.props.onInit, /* function(e, ui) { */
	            "success": function success(ui, resp) {
	                if (_this.props.onSuccess) {
	                    _this.props.onSuccess(ui, resp);
	                }
	                if (_this.props.region) {
	                    $(_this.props.region).asRegion().refresh();
	                }
	            }
	        });
	    },

	    render: function render() {
	        return _react2["default"].createElement(
	            "div",
	            { key: this.key, className: "btn-group" },
	            _react2["default"].createElement(
	                "button",
	                { className: "btn btn-success", onClick: this.handleClick },
	                this.props.label || '建立'
	            )
	        );
	    }
	});
	module.exports = exports["default"];

/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	CRUDModal doesn't support different z-index
	It was used to open the side modal.

	This is different from the CRUDModal, we don't use scroll, since the modal is
	smaller.

	Usage:

	    CRUDModal.open({
	      "title": $btn.data("modalTitle") || "編輯" + this.props.modelLabel,
	      "size": "large",
	      "side": true,
	      "closeOnSuccess": true,
	      "url": this.props.baseUrl + "/crud/edit",
	      "id": parseInt($btn.data("recordId")),
	      "init": function(e, ui) {
	        // the modal content init callback
	      },
	      "success": function(ui, resp) {
	        // this will be triggered when the form is submitted successfully
	        that.refs.region.updateRegion();
	      }
	    });

	Originally implemented in bundles/crud/Assets/crud/crud_modal.coffee
	*/
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CRUDRelModal = {};

	CRUDRelModal.open = function (title, url, args, config) {

	  var defer = jQuery.Deferred();
	  var predefinedArgs = { "_submit_btn": false, "_close_btn": false };
	  var defaultControls = [];

	  defaultControls.push({
	    "label": "儲存", "primary": true, "onClick": function onClick(e, ui) {
	      return ui.body.find("form").submit();
	    }
	  });

	  var ui = ModalManager.createBlock($.extend({
	    "title": title,
	    "size": "large",
	    "controls": defaultControls,
	    "ajax": {
	      "url": url,
	      "args": $.extend(predefinedArgs, args)
	    }
	  }, config || {}));

	  // Initialize the action from the form inside the modal
	  ui.dialog.on("dialog.ajax.done", function (e, ui) {
	    var $form = ui.body.find("form");
	    var form = ui.body.find("form").get(0);
	    var $msgbox = $form.prev('.action-result-container').first();
	    var a = Action.form(form, {
	      "clear": false,
	      "onSuccess": function onSuccess(resp) {
	        setTimeout(function () {
	          // XXX: this weird, we have to find the .modal itself to close it
	          // instead of using "ui.dialog"
	          ui.container.find('.modal').modal('hide');
	        }, 1000);
	        defer.resolve(resp);

	        if (config.success) {
	          config.success.call(this, ui, resp);
	        }
	      }
	    });
	    a.plug(new ActionBootstrapHighlight());
	    a.plug(new ActionMsgbox({
	      'disableScroll': true,
	      'container': $msgbox
	    }));
	  });

	  var $m = ui.container.find('.modal');
	  $m.modal('show'); // TODO: support modal config here
	  $m.on('shown.bs.modal', function (event) {});
	  $m.on('hide.bs.modal', function (event) {
	    ui.container.remove();
	  });
	  return defer;
	};
	exports["default"] = CRUDRelModal;
	module.exports = exports["default"];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _CRUDRelModal = __webpack_require__(7);

	var _CRUDRelModal2 = _interopRequireDefault(_CRUDRelModal);

	/*
	<CRUDEditButton 
	    label="Edit"
	    size="large"
	    side=false
	    recordKey={3}
	    baseUrl=/bs/user
	>
	</CRUDEditButton>

	*/
	exports["default"] = _react2["default"].createClass({
	  displayName: "CRUDEditButton",

	  propTypes: {
	    /**
	     * label of the button
	     */
	    "label": _react2["default"].PropTypes.string,

	    /*
	     * the baseUrl of a CRUD handler, usually "/bs"
	     */
	    "baseUrl": _react2["default"].PropTypes.string,

	    /**
	     * the region DOM element used for updating.
	     */
	    "region": _react2["default"].PropTypes.any,

	    // modal related options
	    // ==============================
	    /**
	     * the modal size: it could be "large", "small"
	     */
	    "size": _react2["default"].PropTypes.string,

	    /**
	     * show the modal as a side modal?
	     */
	    "side": _react2["default"].PropTypes.bool,

	    /**
	     * the title of the modal
	     */
	    "title": _react2["default"].PropTypes.string,

	    /**
	     * The primary key of the record. the reason we didn't use "key" is because react already uses "key" as the component key.
	     */
	    "recordKey": _react2["default"].PropTypes.any.isRequired,

	    "onInit": _react2["default"].PropTypes.func,

	    "onSuccess": _react2["default"].PropTypes.func
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {};
	  },

	  getInitialState: function getInitialState() {
	    return {};
	  },

	  componentDidMount: function componentDidMount() {},

	  componentWillUnmount: function componentWillUnmount() {},

	  handleClick: function handleClick(e) {
	    var _this = this;

	    e.stopPropagation();

	    var args = {};

	    args.key = this.props.recordKey;

	    _CRUDRelModal2["default"].open(this.props.title || this.props.label || 'Untitled', this.props.baseUrl + "/crud/edit", args, {
	      "size": this.props.size || "large",
	      "side": this.props.side || false,
	      "closeOnSuccess": true,
	      "init": this.props.onInit, /* function(e, ui) { */
	      "success": function success(ui, resp) {
	        if (_this.props.onSuccess) {
	          _this.props.onSuccess(ui, resp);
	        }
	        if (_this.props.region) {
	          $(_this.props.region).asRegion().refresh();
	        }
	      }
	    });
	  },

	  render: function render() {
	    return _react2["default"].createElement(
	      "div",
	      { key: this.key, className: "btn-group" },
	      _react2["default"].createElement(
	        "button",
	        { className: "btn btn-success", onClick: this.handleClick },
	        this.props.label || '編輯'
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _CRUDRelModal = __webpack_require__(7);

	var _CRUDRelModal2 = _interopRequireDefault(_CRUDRelModal);

	/*
	<CRUDDeleteButton 
	    label="Create"
	    size="large"
	    side=false
	    baseUrl=/bs/user
	>
	</CRUDDeleteButton>
	*/
	exports["default"] = _react2["default"].createClass({
	    displayName: "CRUDDeleteButton",

	    propTypes: {
	        /**
	         * label of the button
	         */
	        "label": _react2["default"].PropTypes.string,

	        /*
	         * the baseUrl of a CRUD handler, usually "/bs"
	         */
	        "baseUrl": _react2["default"].PropTypes.string,

	        "region": _react2["default"].PropTypes.any,

	        /**
	         * The parent record key is used for creating a new record belongs to the parent.
	         */
	        "recordKey": _react2["default"].PropTypes.any,

	        // modal related options
	        // ==============================
	        /**
	         * the modal size: it could be "large", "small"
	         */
	        "size": _react2["default"].PropTypes.string,

	        /**
	         * show the modal as a side modal?
	         */
	        "side": _react2["default"].PropTypes.bool,

	        /**
	         * the title of the modal
	         */
	        "title": _react2["default"].PropTypes.string,

	        "onInit": _react2["default"].PropTypes.func,

	        "onSuccess": _react2["default"].PropTypes.func
	    },

	    getDefaultProps: function getDefaultProps() {
	        return {};
	    },

	    getInitialState: function getInitialState() {
	        return {};
	    },

	    componentDidMount: function componentDidMount() {},

	    componentWillUnmount: function componentWillUnmount() {},

	    handleClick: function handleClick(e) {
	        var _this = this;

	        e.stopPropagation();
	        _CRUDRelModal2["default"].open(this.props.title || this.props.label || 'Untitled', this.props.baseUrl + "/crud/delete", { key: this.props.recordKey }, {
	            "size": this.props.size || "large",
	            "side": this.props.side || false,
	            "closeOnSuccess": true,
	            "controls": [{
	                "label": "刪除",
	                "primary": true,
	                "onClick": function onClick(e, ui) {
	                    return ui.body.find("form").submit();
	                }
	            }],
	            "init": this.props.onInit, /* function(e, ui) { */
	            "success": function success(ui, resp) {
	                if (_this.props.onSuccess) {
	                    _this.props.onSuccess(ui, resp);
	                }
	                if (_this.props.region) {
	                    $(_this.props.region).asRegion().refresh();
	                }
	            }
	        });
	    },

	    render: function render() {
	        return _react2["default"].createElement(
	            "div",
	            { key: this.key, className: "btn-group" },
	            _react2["default"].createElement(
	                "button",
	                { className: "btn btn-success", onClick: this.handleClick },
	                this.props.label || '刪除'
	            )
	        );
	    }
	});
	module.exports = exports["default"];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _CRUDListKeywordFilterControl = __webpack_require__(11);

	var _CRUDListKeywordFilterControl2 = _interopRequireDefault(_CRUDListKeywordFilterControl);

	var _CRUDListApp = __webpack_require__(12);

	var _CRUDListApp2 = _interopRequireDefault(_CRUDListApp);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	exports['default'] = _react2['default'].createClass({
	  displayName: 'CRUDListEditor',

	  mixins: [_CRUDListApp2['default']],
	  getInitialState: function getInitialState() {
	    return {};
	  },
	  renderFilterSection: function renderFilterSection() {
	    return _react2['default'].createElement(
	      'div',
	      { className: 'well multiple-filter-container' },
	      _react2['default'].createElement(
	        'div',
	        { className: 'form-inline' },
	        _react2['default'].createElement(
	          'div',
	          { className: 'form-group' },
	          _react2['default'].createElement(
	            'label',
	            null,
	            '篩選條件'
	          )
	        ),
	        _react2['default'].createElement(_CRUDListKeywordFilterControl2['default'], { context: this.state.context, placeholder: '請輸入關鍵字' })
	      )
	    );
	  }
	});
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var React = __webpack_require__(3);

	exports["default"] = React.createClass({
	  displayName: "CRUDListKeywordFilterControl",

	  getInitialState: function getInitialState() {
	    return {};
	  },

	  handleChange: function handleChange(e) {
	    this.props.context.actionCreators.applyFilter("_q", e.target.value);
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "form-group" },
	      React.createElement("input", { className: "form-control",
	        type: "text",
	        placeholder: this.props.placeholder,
	        onChange: this.handleChange })
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _CRUDListKeywordFilterControl = __webpack_require__(11);

	var _CRUDListKeywordFilterControl2 = _interopRequireDefault(_CRUDListKeywordFilterControl);

	var _CRUDListSelectionSection = __webpack_require__(13);

	var _CRUDListSelectionSection2 = _interopRequireDefault(_CRUDListSelectionSection);

	var _CRUDListRegion = __webpack_require__(14);

	var _CRUDListRegion2 = _interopRequireDefault(_CRUDListRegion);

	var _actionsCRUDListActionCreators = __webpack_require__(20);

	var _actionsCRUDListActionCreators2 = _interopRequireDefault(_actionsCRUDListActionCreators);

	var _CRUDListPageSizeControl = __webpack_require__(21);

	var _CRUDListPageSizeControl2 = _interopRequireDefault(_CRUDListPageSizeControl);

	var _CRUDListPaginationControl = __webpack_require__(22);

	var _CRUDListPaginationControl2 = _interopRequireDefault(_CRUDListPaginationControl);

	// used store

	var _storesCRUDListSummaryStore = __webpack_require__(23);

	var _storesCRUDListSummaryStore2 = _interopRequireDefault(_storesCRUDListSummaryStore);

	var _storesCRUDListFilterStore = __webpack_require__(15);

	var _storesCRUDListFilterStore2 = _interopRequireDefault(_storesCRUDListFilterStore);

	var _storesCRUDListSelectionStore = __webpack_require__(24);

	var _storesCRUDListSelectionStore2 = _interopRequireDefault(_storesCRUDListSelectionStore);

	var _CRUDCreateButton = __webpack_require__(6);

	var _CRUDCreateButton2 = _interopRequireDefault(_CRUDCreateButton);

	var _BulkManager = __webpack_require__(25);

	var _BulkManager2 = _interopRequireDefault(_BulkManager);

	var _flux = __webpack_require__(26);

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	exports['default'] = {

	  propTypes: {
	    /**
	     * The crud Id, which could be: "org", "users", "stores" ... etc
	     */
	    "crudId": _react2['default'].PropTypes.string.isRequired,

	    /*
	     * the baseUrl of a CRUD handler, usually "/bs"
	     */
	    "baseUrl": _react2['default'].PropTypes.string,
	    "basepath": _react2['default'].PropTypes.string, // previous property

	    "namespace": _react2['default'].PropTypes.string.isRequired,
	    "model": _react2['default'].PropTypes.string.isRequired,
	    "modelLabel": _react2['default'].PropTypes.string.isRequired,
	    "controls": _react2['default'].PropTypes.array,
	    // csrf token is needed for sending actions
	    "csrfToken": _react2['default'].PropTypes.string,

	    "disableSelection": _react2['default'].PropTypes.bool
	  },

	  getDefaultProps: function getDefaultProps() {
	    return { "filters": {} };
	  },

	  getInitialState: function getInitialState() {
	    var dispatcher = new _flux.Dispatcher();
	    var context = {
	      "dispatcher": dispatcher
	    };
	    context.filterStore = new _storesCRUDListFilterStore2['default'](context, this.props.filters);
	    context.selectionStore = new _storesCRUDListSelectionStore2['default'](context);
	    context.summaryStore = new _storesCRUDListSummaryStore2['default'](context);
	    context.actionCreators = new _actionsCRUDListActionCreators2['default'](context);
	    return {
	      "context": context,
	      "filters": this.props.filters
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    // the summary should be updated when filter is changed.
	    this.state.context.filterStore.addChangeListener(this.handleFilterChange);
	    this.state.context.summaryStore.addChangeListener(this.handleSummaryChange);
	    this.state.context.actionCreators.updateSummary(this.props.baseUrl || this.props.basepath, this.state.context.filterStore.getArgs());
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.state.context.filterStore.removeChangeListener(this.handleFilterChange);
	    this.state.context.summaryStore.removeChangeListener(this.handleSummaryChange);
	  },

	  handleCreateAction: function handleCreateAction(e) {
	    e.stopPropagation();
	    var that = this;
	    CRUDModal.open({
	      "title": "建立新的" + this.props.modelLabel,
	      "size": "large",
	      "side": true,
	      "url": (this.props.basepath || this.props.baseUrl) + "/crud/create",
	      "closeOnSuccess": true,
	      "init": function init(e, ui) {
	        // the modal content init callback
	      },
	      "success": function success(ui, resp) {}
	    });
	  },

	  handleEditAction: function handleEditAction(e) {
	    e.stopPropagation();
	    var that = this;
	    var $btn = $(e.currentTarget);
	    CRUDModal.open({
	      "title": $btn.data("modalTitle") || "編輯" + this.props.modelLabel,
	      "size": "large",
	      "side": true,
	      "closeOnSuccess": true,
	      "url": (this.props.basepath || this.props.baseUrl) + "/crud/edit",
	      "id": parseInt($btn.data("recordId")),
	      "init": function init(e, ui) {
	        // the modal content init callback
	      },
	      "success": function success(ui, resp) {
	        // this will be triggered when the form is submitted successfully
	        that.refs.region.updateRegion();
	      }
	    });
	  },

	  handleExcelExportAction: function handleExcelExportAction(e) {
	    // get the arguments from current state
	    var params = this.refs.region.getCurrentQueryParams();
	    var url = (this.props.basepath || this.props.baseUrl) + "/export/excel?" + jQuery.param(params);
	    window.location = url;
	  },

	  handleCsvExportAction: function handleCsvExportAction(e) {
	    // get the arguments from current state
	    var params = this.refs.region.getCurrentQueryParams();
	    var url = (this.props.basepath || this.props.baseUrl) + "/export/csv?" + jQuery.param(params);
	    window.location = url;
	  },

	  handleImportAction: function handleImportAction(e) {
	    e.stopPropagation();
	    var that = this;

	    var proceedToExcelImport = function proceedToExcelImport(ui, resp) {
	      CRUDModal.update(ui, {
	        "title": "匯入中...",
	        "content": "匯入中...",
	        "controls": []
	      });
	      var params = {};

	      // TODO: Rename ImportOrgSimple to customized action name
	      runAction("OrgBundle::Action::ImportOrgSimple", params, function (resp) {
	        if (resp.success) {
	          CRUDModal.update(ui, {
	            "title": "匯入完畢",
	            "content": resp.message,
	            "controls": [{ "label": "關閉", "close": true }]
	          });
	        } else {
	          CRUDModal.update(ui, {
	            "title": "匯入發生錯誤",
	            "content": resp.message,
	            "controls": [{ "label": "關閉", "close": true }]
	          });
	        }
	      });
	    };

	    var proceedToColumnSelection = function proceedToColumnSelection(ui, resp) {
	      CRUDModal.update(ui, {
	        "title": "選擇對應欄位",
	        "ajax": {
	          "url": (this.props.basepath || that.props.baseUrl) + "/import/column-map"
	        },
	        "controls": [],
	        "init": function init(e, ui) {},
	        "success": function success(ui, resp) {}
	      });
	    };

	    CRUDModal.open({
	      "title": "匯入資料",
	      "size": "large",
	      "side": true,
	      "url": (this.props.basepath || that.props.baseUrl) + "/import/upload",
	      "init": function init(e, ui) {
	        // the modal content init callback
	      },
	      "success": function success(ui, resp) {
	        if (resp.data.advanced) {
	          proceedToColumnSelection(ui, resp);
	        } else {
	          proceedToExcelImport(ui, resp);
	        }
	      },
	      "controls": [{ "label": "上傳", "primary": true, "onClick": function onClick(e, ui) {
	          ui.body.find("form").submit();
	        } }]
	    });
	  },

	  /**
	   * @param {Event}
	   */
	  handleSummaryChange: function handleSummaryChange(e) {
	    var summary = this.state.context.summaryStore.getSummary();
	    if (this.refs.selectionSection) {
	      this.refs.selectionSection.setState({ "numberOfTotalItems": summary.numberOfTotalItems });
	    }

	    if (this.refs.pagination) {
	      var numberOfPages = summary.numberOfTotalItems ? Math.ceil(summary.numberOfTotalItems / this.state.context.filterStore.getPageSize()) : 1;
	      this.refs.pagination.setState({
	        "numberOfPages": numberOfPages
	      });
	    }
	  },

	  /**
	   * @param {Event}
	   */
	  handleFilterChange: function handleFilterChange(e) {
	    this.state.context.actionCreators.updateSummary(this.props.basepath || this.props.baseUrl, this.state.context.filterStore.getArgs());
	    if (this.refs.pagination) {
	      this.refs.pagination.setState({
	        "pageSize": this.state.context.filterStore.getPageSize(),
	        "currentPage": this.state.context.filterStore.getPage()
	      });
	    }
	  },

	  /**
	   * @param {Event}
	   */
	  handleSelect: function handleSelect(e) {
	    e.stopPropagation();
	    var $input = $(e.currentTarget);
	    var $tr = $input.parents("tr");
	    var val = parseInt($input.val());
	    // "active" class is used for bootstrap
	    if ($input.is(':checked')) {
	      $tr.addClass('selected active');
	      this.state.context.actionCreators.addSelection(val);
	    } else {
	      $tr.removeClass('selected active');
	      this.state.context.actionCreators.removeSelection(val);
	    }
	  },

	  /**
	   * handleRowSelect add the checkbox into selectionStore
	   *
	   * @param {Event}
	   */
	  handleRowSelect: function handleRowSelect(e) {
	    e.stopPropagation();
	    var $check, $tr, val;
	    if ($(e.target).is("span.check") || $(e.target).is(".crud-bulk-select")) {
	      return;
	    }
	    $tr = $(e.currentTarget);
	    $check = $tr.find('.crud-bulk-select');
	    val = parseInt($check.val());
	    if ($check.is(':checked')) {
	      $check.prop('checked', false);
	      $tr.removeClass('selected active');
	      this.state.context.actionCreators.removeSelection(val);
	    } else {
	      $check.prop('checked', true);
	      $tr.addClass('selected active');
	      this.state.context.actionCreators.addSelection(val);
	    }
	  },

	  /**
	   * @param {Event}
	   */
	  handleSelectAll: function handleSelectAll(e) {
	    var that = this;
	    e.stopPropagation();
	    this.bulkManager.toggleSelectAll(e);

	    // update selections in the store
	    var checkboxes = this.bulkManager.findCheckboxes();
	    checkboxes.each(function () {
	      var $input = $(this);
	      var val = parseInt($input.val());
	      if ($input.is(":checked")) {
	        that.state.context.actionCreators.addSelection(val);
	      } else {
	        that.state.context.actionCreators.removeSelection(val);
	      }
	    });
	  },

	  /**
	   * @param {Exception}
	   */
	  handleRecordDelete: function handleRecordDelete(e) {
	    e.stopPropagation();
	    var $btn = $(e.currentTarget);
	    if (!$btn.data("delete-action")) {
	      console.error("data-delete-action undefined");
	      return;
	    }
	    var id = $btn.data("record-key");
	    runAction($btn.data("delete-action"), { "id": id }, { "confirm": "確認刪除? ", "removeTr": $btn });
	  },

	  /**
	   * @param {jQuery} $region
	   */
	  initListManager: function initListManager($region) {
	    var that = this;
	    this.table = $region.find('.crud-list table');
	    this.bulkManager = new _BulkManager2['default'](this.table);
	    this.bulkManager.init();

	    // Apply selection from CRUDListSelectionStore
	    var selections = this.state.context.selectionStore.getSelection();
	    $(selections).each(function () {
	      var $input = that.bulkManager.findCheckboxByValue(this);
	      if ($input[0]) {
	        $input.prop('checked', true);
	      }
	    });

	    // Handle select All event
	    this.table.on("click", ".crud-bulk-select-all", this.handleSelectAll);

	    // Handle checkbox change event
	    this.table.on("change", "input.crud-bulk-select", this.handleSelect);

	    // initialized row click event
	    this.table.on("click", "tbody tr", this.handleRowSelect);

	    // handle edit button click event
	    // TODO:
	    // the handler depends on bulk config array and CRUDModal object make it
	    // generic to be passed from app props
	    this.table.on("click", ".record-edit-btn", this.handleEditAction);
	    this.table.on("click", ".record-delete-btn", this.handleRecordDelete);
	  },

	  /**
	   * @param {HTMLElement} controlConfig
	   */
	  onRegionLoaded: function onRegionLoaded(regionDom) {
	    var $region = $(regionDom);
	    if (this._initTimer) {
	      clearTimeout(this._initTimer);
	      this._initTimer = null;
	    }
	    this._initTimer = setTimeout(function () {
	      jQuery.material.checkbox($region.find('.checkbox > label > input[type=checkbox]'));
	    }, 300);
	    this.initListManager($region);
	  },

	  // renderFilterSection: function() { },

	  /**
	   * @param {object} controlConfig
	   */
	  renderCreateControl: function renderCreateControl(controlConfig) {
	    var _this = this;

	    return _react2['default'].createElement(_CRUDCreateButton2['default'], {
	      key: "create",
	      label: "建立新的" + this.props.modelLabel,
	      title: "建立新的" + this.props.modelLabel,
	      baseUrl: this.props.baseUrl,
	      size: "large",
	      side: true,
	      onSuccess: function (ui, resp) {
	        // this will be triggered when the form is submitted successfully
	        _this.refs.region.updateRegion();
	      }
	    });
	  },

	  /**
	   * @param {object} controlConfig
	   */
	  renderImportControl: function renderImportControl(controlConfig) {
	    return;
	    _react2['default'].createElement(
	      'div',
	      { key: 'import', className: 'btn-group' },
	      _react2['default'].createElement(
	        'button',
	        { className: 'btn btn-material-grey-700', onClick: this.handleImportAction },
	        controlConfig.label || '匯入'
	      )
	    );
	  },

	  /**
	   * @param {object} controlConfig
	   */
	  renderExportControl: function renderExportControl(controlConfig) {
	    return;
	    _react2['default'].createElement(
	      'div',
	      { key: 'export', className: 'btn-group' },
	      _react2['default'].createElement(
	        'div',
	        { className: 'dropdown' },
	        _react2['default'].createElement(
	          'button',
	          { className: 'btn btn-default btn-material-grey-700 dropdown-toggle', type: 'button', 'data-toggle': 'dropdown' },
	          controlConfig.label || '匯出',
	          ' ',
	          _react2['default'].createElement('span', { className: 'caret' })
	        ),
	        _react2['default'].createElement(
	          'ul',
	          { className: 'dropdown-menu' },
	          _react2['default'].createElement(
	            'li',
	            null,
	            _react2['default'].createElement(
	              'a',
	              { href: '#', onClick: this.handleCsvExportAction },
	              'Export CSV'
	            )
	          ),
	          _react2['default'].createElement(
	            'li',
	            null,
	            _react2['default'].createElement(
	              'a',
	              { href: '#', onClick: this.handleExcelExportAction },
	              'Export Excel'
	            )
	          )
	        )
	      )
	    );
	  },

	  /**
	   * @param {Array<object>} target
	   */
	  renderControls: function renderControls(controls) {
	    var _this2 = this;

	    var childViews = [];

	    controls.forEach(function (controlConfig, i) {
	      var a = controlConfig.action || controlConfig.feature;
	      switch (a) {
	        case "create":
	          childViews.push(_this2.renderCreateControl(controlConfig));
	          break;
	        case "export":
	          childViews.push(_this2.renderExportControl(controlConfig));
	          break;
	        case "import":
	          childViews.push(_this2.renderImportControl(controlConfig));
	          break;
	      }
	    });
	    return _react2['default'].createElement(
	      'div',
	      { className: 'control-section' },
	      _react2['default'].createElement(
	        'div',
	        { className: 'btn-toolbar' },
	        childViews
	      )
	    );
	  },

	  render: function render() {
	    var that = this;
	    var controlSection = this.renderControls(this.props.controls);
	    return _react2['default'].createElement(
	      'div',
	      { className: 'crud-list-container' },
	      controlSection,
	      this.renderFilterSection ? this.renderFilterSection() : null,
	      _react2['default'].createElement(
	        'div',
	        { className: 'clearfix custom-row row' },
	        this.props.disableSelection ? null : _react2['default'].createElement(
	          'div',
	          { className: 'col-md-4 pull-left' },
	          _react2['default'].createElement(_CRUDListSelectionSection2['default'], {
	            ref: 'selectionSection',
	            selectionStore: this.state.context.selectionStore,
	            app: this,
	            context: this.state.context
	          })
	        ),
	        _react2['default'].createElement(
	          'div',
	          { className: 'upon-table-pager col-md-8 pull-right' },
	          _react2['default'].createElement(
	            'div',
	            { className: 'form-inline' },
	            _react2['default'].createElement(_CRUDListPageSizeControl2['default'], {
	              ref: 'pageSize',
	              context: this.state.context,
	              pageSize: this.state.context.filterStore.getPageSize()
	            }),
	            _react2['default'].createElement(_CRUDListPaginationControl2['default'], {
	              ref: 'pagination',
	              context: this.state.context,
	              pageSize: this.state.context.filterStore.getPageSize()
	            })
	          )
	        )
	      ),
	      _react2['default'].createElement(_CRUDListRegion2['default'], { ref: 'region',
	        path: (this.props.baseUrl || this.props.basepath) + "/crud/list_inner",
	        context: this.state.context,
	        filterStore: this.state.context.filterStore,
	        args: this.state.filters,
	        onLoad: this.onRegionLoaded })
	    );
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(3);
	exports["default"] = React.createClass({
	  displayName: "CRUDListSelectionSection",

	  propTypes: function propTypes() {
	    return {
	      // CRUD app
	      "app": React.Types.object.isRequired,
	      "context": React.Types.object.isRequired
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      "numberOfTotalItems": 0,
	      "numberOfSelectedItems": 0
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.props.context.selectionStore.addChangeListener(this._onChange);
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.props.context.selectionStore.removeChangeListener(this._onChange);
	  },

	  _onChange: function _onChange() {
	    this.setState(function (previousState, props) {
	      var selectedKeys = this.props.context.selectionStore.getSelection();
	      previousState.numberOfSelectedItems = selectedKeys.length;
	    });
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      { className: "toggle-filter-container" },
	      React.createElement(
	        "a",
	        { href: "#", className: "text-primary filter-item active" },
	        "全部",
	        this.props.app.props.modelLabel,
	        " (",
	        this.state.numberOfTotalItems,
	        ")"
	      ),
	      React.createElement(
	        "a",
	        { href: "#", className: "text-primary filter-item" },
	        "已選擇 (",
	        React.createElement(
	          "span",
	          { className: "number-of-selected-items" },
	          this.state.numberOfSelectedItems
	        ),
	        ")"
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _storesCRUDListFilterStore = __webpack_require__(15);

	var _storesCRUDListFilterStore2 = _interopRequireDefault(_storesCRUDListFilterStore);

	var React = __webpack_require__(3);
	exports["default"] = React.createClass({
	  displayName: "CRUDListRegion",

	  propTypes: {
	    "path": React.PropTypes.string.isRequired,
	    "context": React.PropTypes.object.isRequired
	  },

	  getInitialState: function getInitialState() {
	    return {
	      "args": this.props.args || {},
	      "path": this.props.path
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.props.context.filterStore.addChangeListener(this._onFilterChange);
	    this.updateRegion();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.props.context.filterStore.removeChangeListener(this._onFilterChange);
	  },

	  getCurrentQueryParams: function getCurrentQueryParams() {
	    return this.state.args || {};
	  },

	  updateRegion: function updateRegion(callback) {
	    var that = this;
	    $.get(this.state.path, this.state.args, function (htmlResponse) {
	      if (that.isMounted()) {
	        that.setRegionContent(htmlResponse);
	        if (callback) {
	          callback();
	        }
	        if (that.props.onLoad) {
	          that.props.onLoad(ReactDOM.findDOMNode(that.refs.content));
	        }
	      }
	    });
	  },

	  setRegionContent: function setRegionContent(content) {
	    if (this.refs.content) {
	      var el = ReactDOM.findDOMNode(this.refs.content);
	      if (el) {
	        // innerHTML assignment will ignore javascripts
	        // el.innerHTML = content;
	        jQuery(el).html(content);
	      }
	    }
	  },

	  _onFilterChange: function _onFilterChange() {
	    var that = this;
	    var newArgs = this.props.context.filterStore.getArgs();
	    this.setState(function (previousState, currentProps) {
	      var args = previousState.args;
	      for (var key in newArgs) {
	        args[key] = newArgs[key];
	      }
	      return { "args": args };
	    }, function () {
	      that.updateRegion();
	    });
	  },

	  render: function render() {
	    return React.createElement("div", { ref: "content" });
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var constants = __webpack_require__(16);
	var EventEmitter = __webpack_require__(18).EventEmitter;
	var assign = __webpack_require__(19);
	var ActionTypes = constants.ActionTypes;

	var CHANGE_EVENT = 'change';

	var CRUDListFilterStore = (function (_EventEmitter) {
	  _inherits(CRUDListFilterStore, _EventEmitter);

	  function CRUDListFilterStore(context, filters) {
	    _classCallCheck(this, CRUDListFilterStore);

	    _get(Object.getPrototypeOf(CRUDListFilterStore.prototype), 'constructor', this).call(this);
	    this.path = "";
	    this.args = filters || {};

	    var that = this;
	    this.dispatchToken = context.dispatcher.register(function (action) {
	      switch (action.type) {
	        case ActionTypes.FILTER_CHANGE:
	          // merge arguments from the event of filter
	          if (action.key) {
	            that.setArg(action.key, action.value);
	          } else if (action.args) {
	            that.updateArgs(action.args);
	          }
	          break;
	      }
	    });
	  }

	  _createClass(CRUDListFilterStore, [{
	    key: 'getArgs',
	    value: function getArgs() {
	      return this.args;
	    }
	  }, {
	    key: 'getPath',
	    value: function getPath() {
	      return this.path;
	    }
	  }, {
	    key: 'setArg',
	    value: function setArg(key, val) {
	      this.args[key] = val;
	      this.emitChangeEvent();
	    }
	  }, {
	    key: 'getPage',
	    value: function getPage() {
	      return this.args["page"];
	    }
	  }, {
	    key: 'getPageSize',
	    value: function getPageSize() {
	      return this.args["pagenum"] || 10;
	    }
	  }, {
	    key: 'updateArgs',
	    value: function updateArgs(args) {
	      for (var key in args) {
	        this.args[key] = args[key];
	      }
	      this.emitChangeEvent();
	    }
	  }, {
	    key: 'emitChangeEvent',
	    value: function emitChangeEvent() {
	      this.emit(CHANGE_EVENT);
	    }
	  }, {
	    key: 'addChangeListener',
	    value: function addChangeListener(callback) {
	      this.on(CHANGE_EVENT, callback);
	    }
	  }, {
	    key: 'removeChangeListener',
	    value: function removeChangeListener(callback) {
	      this.removeListener(CHANGE_EVENT, callback);
	    }
	  }]);

	  return CRUDListFilterStore;
	})(EventEmitter);

	exports['default'] = CRUDListFilterStore;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var keyMirror = __webpack_require__(17);

	// Define action constants
	module.exports = {
	  "ActionTypes": keyMirror({
	    FILTER_CHANGE: null,
	    SELECT_RECORD: null,
	    DESELECT_RECORD: null,
	    CHANGE_PAGE_SIZE: null,
	    CHANGE_PAGE: null,
	    SUMMARY_UPDATE: null
	  })
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 */

	"use strict";

	/**
	 * Constructs an enumeration with keys equal to their value.
	 *
	 * For example:
	 *
	 *   var COLORS = keyMirror({blue: null, red: null});
	 *   var myColor = COLORS.blue;
	 *   var isColorValid = !!COLORS[myColor];
	 *
	 * The last line could not be performed if the values of the generated enum were
	 * not equal to their keys.
	 *
	 *   Input:  {key1: val1, key2: val2}
	 *   Output: {key1: key1, key2: key2}
	 *
	 * @param {object} obj
	 * @return {object}
	 */
	var keyMirror = function(obj) {
	  var ret = {};
	  var key;
	  if (!(obj instanceof Object && !Array.isArray(obj))) {
	    throw new Error('keyMirror(...): Argument must be an object.');
	  }
	  for (key in obj) {
	    if (!obj.hasOwnProperty(key)) {
	      continue;
	    }
	    ret[key] = key;
	  }
	  return ret;
	};

	module.exports = keyMirror;


/***/ },
/* 18 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 19 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ActionTypes = __webpack_require__(16).ActionTypes;

	var CRUDListActionCreators = (function () {
	  function CRUDListActionCreators(context) {
	    _classCallCheck(this, CRUDListActionCreators);

	    this.dispatcher = context.dispatcher;
	  }

	  _createClass(CRUDListActionCreators, [{
	    key: "addSelection",
	    value: function addSelection(recordId, record) {
	      this.dispatcher.dispatch({
	        "type": ActionTypes.SELECT_RECORD,
	        "recordId": recordId,
	        "record": record
	      });
	    }
	  }, {
	    key: "removeSelection",
	    value: function removeSelection(recordId) {
	      this.dispatcher.dispatch({
	        "type": ActionTypes.DESELECT_RECORD,
	        "recordId": recordId
	      });
	    }
	  }, {
	    key: "applyFilters",
	    value: function applyFilters(args) {
	      this.dispatcher.dispatch({
	        "type": ActionTypes.FILTER_CHANGE,
	        "args": args
	      });
	    }
	  }, {
	    key: "applyFilter",
	    value: function applyFilter(key, value) {
	      this.dispatcher.dispatch({
	        "type": ActionTypes.FILTER_CHANGE,
	        "key": key,
	        "value": value
	      });
	    }
	  }, {
	    key: "updateSummary",
	    value: function updateSummary(baseUrl, args) {
	      var that = this;
	      $.getJSON(baseUrl + "/summary", args, function (summary) {
	        that.dispatcher.dispatch({
	          "type": ActionTypes.SUMMARY_UPDATE,
	          "summary": summary
	        });
	      });
	    }
	  }, {
	    key: "changePageSize",
	    value: function changePageSize(pageSize) {
	      // go to the first page when page size is changed.
	      this.applyFilters({ "page": 1, "pagenum": pageSize });
	      this.dispatcher.dispatch({
	        "type": ActionTypes.CHANGE_PAGE_SIZE,
	        "pageSize": pageSize
	      });
	    }
	  }, {
	    key: "changePage",
	    value: function changePage(page) {
	      this.applyFilters({ "page": page });
	      this.dispatcher.dispatch({
	        "type": ActionTypes.CHANGE_PAGE,
	        "page": page
	      });
	    }
	  }]);

	  return CRUDListActionCreators;
	})();

	exports["default"] = CRUDListActionCreators;
	module.exports = exports["default"];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var React = __webpack_require__(3);

	exports["default"] = React.createClass({
	  displayName: "CRUDListPageSizeControl",

	  propTypes: function propTypes() {
	    return {
	      "pageSize": React.PropTypes.string.isRequired
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      "pageSize": this.props.pageSize
	    };
	  },

	  handleChange: function handleChange(e) {
	    var pageSize = ReactDOM.findDOMNode(this.refs.sizeSelect).value;

	    // when page size is updated, update the pagination component
	    this.props.context.actionCreators.changePageSize(pageSize);
	  },

	  render: function render() {
	    var options = [];
	    if (this.props.availableSizes) {
	      options = this.props.availableSizes.map(function (s) {
	        return React.createElement(
	          "option",
	          { key: s, value: s },
	          s
	        );
	      });
	    } else {
	      options.push(React.createElement(
	        "option",
	        { key: 10, value: 10 },
	        "10"
	      ));
	      options.push(React.createElement(
	        "option",
	        { key: 20, value: 20 },
	        "20"
	      ));
	      options.push(React.createElement(
	        "option",
	        { key: 50, value: 50 },
	        "50"
	      ));
	    }
	    return React.createElement(
	      "div",
	      { className: "form-group" },
	      React.createElement(
	        "label",
	        null,
	        "每頁顯示",
	        React.createElement(
	          "select",
	          { ref: "sizeSelect", className: "form-control",
	            defaultValue: this.state.pageSize,
	            onChange: this.handleChange },
	          options
	        ),
	        "筆"
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var React = __webpack_require__(3);

	exports["default"] = React.createClass({
	  displayName: "CRUDListPaginationControl",

	  getInitialState: function getInitialState() {
	    return {
	      "numberOfPages": 1,
	      "currentPage": 1
	    };
	  },

	  handlePaging: function handlePaging(page, e) {
	    e.stopPropagation();
	    this.props.context.actionCreators.applyFilter("page", page);
	  },

	  render: function render() {
	    var pages = this.state.numberOfPages;
	    var currentPage = this.state.currentPage;
	    var pageLinks = [];
	    if (currentPage > 1) {
	      pageLinks.push(React.createElement(
	        "li",
	        { key: "prev-page" },
	        React.createElement(
	          "a",
	          { className: "pager-prev", onClick: this.handlePaging.bind(this, currentPage - 1) },
	          "上一頁"
	        )
	      ));
	    } else {
	      pageLinks.push(React.createElement(
	        "li",
	        { key: "prev-page", className: "disabled" },
	        React.createElement(
	          "a",
	          { className: "pager-prev" },
	          "上一頁"
	        )
	      ));
	    }

	    for (var p = Math.max(1, currentPage - 5); p <= Math.min(currentPage + 5, pages); p++) {
	      pageLinks.push(React.createElement(
	        "li",
	        { key: p, className: currentPage == p ? "active" : "" },
	        React.createElement(
	          "a",
	          { className: "pager-number", onClick: this.handlePaging.bind(this, p) },
	          p
	        )
	      ));
	    }

	    if (pages > 1 && currentPage < pages) {
	      pageLinks.push(React.createElement(
	        "li",
	        { key: "next-page" },
	        React.createElement(
	          "a",
	          { className: "pager-prev", onClick: this.handlePaging.bind(this, currentPage + 1) },
	          "下一頁"
	        )
	      ));
	    } else {
	      pageLinks.push(React.createElement(
	        "li",
	        { key: "next-page", className: "disabled" },
	        React.createElement(
	          "a",
	          { className: "pager-prev" },
	          "下一頁"
	        )
	      ));
	    }

	    return React.createElement(
	      "div",
	      { className: "form-group" },
	      React.createElement(
	        "ul",
	        { className: "pagination pagination-sm" },
	        pageLinks
	      )
	    );
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var constants = __webpack_require__(16);
	var EventEmitter = __webpack_require__(18).EventEmitter;
	var assign = __webpack_require__(19);
	var ActionTypes = constants.ActionTypes;

	var CHANGE_EVENT = 'change';

	var CRUDListSummaryStore = (function (_EventEmitter) {
	  _inherits(CRUDListSummaryStore, _EventEmitter);

	  function CRUDListSummaryStore(context) {
	    _classCallCheck(this, CRUDListSummaryStore);

	    _get(Object.getPrototypeOf(CRUDListSummaryStore.prototype), 'constructor', this).call(this);
	    this.summary = {};
	    var that = this;
	    this.dispatchToken = context.dispatcher.register(function (action) {
	      switch (action.type) {
	        case ActionTypes.SUMMARY_UPDATE:
	          that.summary = action.summary;
	          that.emitChangeEvent();
	          break;
	      }
	    });
	  }

	  _createClass(CRUDListSummaryStore, [{
	    key: 'getSummary',
	    value: function getSummary() {
	      return this.summary;
	    }
	  }, {
	    key: 'emitChangeEvent',
	    value: function emitChangeEvent() {
	      this.emit(CHANGE_EVENT);
	    }
	  }, {
	    key: 'addChangeListener',
	    value: function addChangeListener(callback) {
	      this.on(CHANGE_EVENT, callback);
	    }
	  }, {
	    key: 'removeChangeListener',
	    value: function removeChangeListener(callback) {
	      this.removeListener(CHANGE_EVENT, callback);
	    }
	  }]);

	  return CRUDListSummaryStore;
	})(EventEmitter);

	exports['default'] = CRUDListSummaryStore;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var constants = __webpack_require__(16);
	var EventEmitter = __webpack_require__(18).EventEmitter;
	var assign = __webpack_require__(19);
	var ActionTypes = constants.ActionTypes;

	var CHANGE_EVENT = 'change';

	var CRUDListSelectionStore = (function (_EventEmitter) {
	  _inherits(CRUDListSelectionStore, _EventEmitter);

	  function CRUDListSelectionStore(context) {
	    _classCallCheck(this, CRUDListSelectionStore);

	    _get(Object.getPrototypeOf(CRUDListSelectionStore.prototype), 'constructor', this).call(this);
	    var that = this;
	    this.selections = {};
	    this.dispatchToken = context.dispatcher.register(function (action) {
	      switch (action.type) {
	        case ActionTypes.DESELECT_RECORD:
	          that.removeSelection(action.recordId);
	          break;
	        case ActionTypes.SELECT_RECORD:
	          that.addSelection(action.recordId);
	          break;
	      }
	    });
	  }

	  _createClass(CRUDListSelectionStore, [{
	    key: 'hasSelection',
	    value: function hasSelection(recordId) {
	      return this.selections[recordId] ? true : false;
	    }
	  }, {
	    key: 'addSelection',
	    value: function addSelection(recordId, record) {
	      this.selections[recordId] = record || true;
	      this.emitChangeEvent();
	    }
	  }, {
	    key: 'removeSelection',
	    value: function removeSelection(recordId) {
	      delete this.selections[recordId];
	      this.emitChangeEvent();
	    }
	  }, {
	    key: 'clearSelection',
	    value: function clearSelection() {
	      this.selections = {};
	      this.emitChangeEvent();
	    }
	  }, {
	    key: 'getSelection',
	    value: function getSelection() {
	      var keys = [];
	      for (var key in this.selections) {
	        keys.push(parseInt(key));
	      }
	      return keys;
	    }
	  }, {
	    key: 'emitChangeEvent',
	    value: function emitChangeEvent() {
	      this.emit(CHANGE_EVENT);
	    }
	  }, {
	    key: 'addChangeListener',
	    value: function addChangeListener(callback) {
	      this.on(CHANGE_EVENT, callback);
	    }
	  }, {
	    key: 'removeChangeListener',
	    value: function removeChangeListener(callback) {
	      this.removeListener(CHANGE_EVENT, callback);
	    }
	  }]);

	  return CRUDListSelectionStore;
	})(EventEmitter);

	exports['default'] = CRUDListSelectionStore;
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var BulkManager = (function () {
	  function BulkManager($table) {
	    _classCallCheck(this, BulkManager);

	    this.table = $table;
	  }

	  _createClass(BulkManager, [{
	    key: 'init',
	    value: function init() {}
	  }, {
	    key: 'findCheckboxByValue',
	    value: function findCheckboxByValue(val) {
	      return this.table.find('input.crud-bulk-select[value="' + val + '"]');
	    }
	  }, {
	    key: 'findCheckboxes',
	    value: function findCheckboxes() {
	      return this.table.find('input.crud-bulk-select');
	    }
	  }, {
	    key: 'findSelectedCheckboxes',
	    value: function findSelectedCheckboxes() {
	      return this.table.find('input.crud-bulk-select:checked');
	    }
	  }, {
	    key: 'findSelectedItemValues',
	    value: function findSelectedItemValues() {
	      return this.findSelectedCheckboxes().map(function (i, e) {
	        return parseInt(e.value);
	      }).get();
	    }
	  }, {
	    key: 'findSelectAllCheckbox',
	    value: function findSelectAllCheckbox() {
	      return this.table.find('input.crud-bulk-select-all');
	    }
	  }, {
	    key: 'deselectAll',
	    value: function deselectAll(e) {
	      if (!e) {
	        this.findSelectAllCheckbox().prop('checked', false);
	      }
	      this.findCheckboxes().prop('checked', false);
	      this.table.find('tbody tr').removeClass('selected active');
	    }
	  }, {
	    key: 'selectAll',
	    value: function selectAll(e) {
	      if (!e) {
	        this.findSelectAllCheckbox().prop('checked', true);
	      }
	      this.findCheckboxes().prop('checked', true);
	      this.table.find('tbody tr').addClass('selected active');
	    }

	    /**
	     * @return boolean true when all is selected, false when all is deselected.
	     */
	  }, {
	    key: 'toggleSelectAll',
	    value: function toggleSelectAll(e) {
	      if (this.findSelectAllCheckbox().is(":checked")) {
	        this.selectAll(e);
	        return true;
	      } else {
	        this.deselectAll(e);
	        return false;
	      }
	    }
	  }]);

	  return BulkManager;
	})();

	exports['default'] = BulkManager;
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	module.exports.Dispatcher = __webpack_require__(27);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright (c) 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule Dispatcher
	 * 
	 * @preventMunge
	 */

	'use strict';

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var invariant = __webpack_require__(29);

	var _prefix = 'ID_';

	/**
	 * Dispatcher is used to broadcast payloads to registered callbacks. This is
	 * different from generic pub-sub systems in two ways:
	 *
	 *   1) Callbacks are not subscribed to particular events. Every payload is
	 *      dispatched to every registered callback.
	 *   2) Callbacks can be deferred in whole or part until other callbacks have
	 *      been executed.
	 *
	 * For example, consider this hypothetical flight destination form, which
	 * selects a default city when a country is selected:
	 *
	 *   var flightDispatcher = new Dispatcher();
	 *
	 *   // Keeps track of which country is selected
	 *   var CountryStore = {country: null};
	 *
	 *   // Keeps track of which city is selected
	 *   var CityStore = {city: null};
	 *
	 *   // Keeps track of the base flight price of the selected city
	 *   var FlightPriceStore = {price: null}
	 *
	 * When a user changes the selected city, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'city-update',
	 *     selectedCity: 'paris'
	 *   });
	 *
	 * This payload is digested by `CityStore`:
	 *
	 *   flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'city-update') {
	 *       CityStore.city = payload.selectedCity;
	 *     }
	 *   });
	 *
	 * When the user selects a country, we dispatch the payload:
	 *
	 *   flightDispatcher.dispatch({
	 *     actionType: 'country-update',
	 *     selectedCountry: 'australia'
	 *   });
	 *
	 * This payload is digested by both stores:
	 *
	 *   CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       CountryStore.country = payload.selectedCountry;
	 *     }
	 *   });
	 *
	 * When the callback to update `CountryStore` is registered, we save a reference
	 * to the returned token. Using this token with `waitFor()`, we can guarantee
	 * that `CountryStore` is updated before the callback that updates `CityStore`
	 * needs to query its data.
	 *
	 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
	 *     if (payload.actionType === 'country-update') {
	 *       // `CountryStore.country` may not be updated.
	 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
	 *       // `CountryStore.country` is now guaranteed to be updated.
	 *
	 *       // Select the default city for the new country
	 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
	 *     }
	 *   });
	 *
	 * The usage of `waitFor()` can be chained, for example:
	 *
	 *   FlightPriceStore.dispatchToken =
	 *     flightDispatcher.register(function(payload) {
	 *       switch (payload.actionType) {
	 *         case 'country-update':
	 *         case 'city-update':
	 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
	 *           FlightPriceStore.price =
	 *             getFlightPriceStore(CountryStore.country, CityStore.city);
	 *           break;
	 *     }
	 *   });
	 *
	 * The `country-update` payload will be guaranteed to invoke the stores'
	 * registered callbacks in order: `CountryStore`, `CityStore`, then
	 * `FlightPriceStore`.
	 */

	var Dispatcher = (function () {
	  function Dispatcher() {
	    _classCallCheck(this, Dispatcher);

	    this._callbacks = {};
	    this._isDispatching = false;
	    this._isHandled = {};
	    this._isPending = {};
	    this._lastID = 1;
	  }

	  /**
	   * Registers a callback to be invoked with every dispatched payload. Returns
	   * a token that can be used with `waitFor()`.
	   */

	  Dispatcher.prototype.register = function register(callback) {
	    var id = _prefix + this._lastID++;
	    this._callbacks[id] = callback;
	    return id;
	  };

	  /**
	   * Removes a callback based on its token.
	   */

	  Dispatcher.prototype.unregister = function unregister(id) {
	    !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	    delete this._callbacks[id];
	  };

	  /**
	   * Waits for the callbacks specified to be invoked before continuing execution
	   * of the current callback. This method should only be used by a callback in
	   * response to a dispatched payload.
	   */

	  Dispatcher.prototype.waitFor = function waitFor(ids) {
	    !this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Must be invoked while dispatching.') : invariant(false) : undefined;
	    for (var ii = 0; ii < ids.length; ii++) {
	      var id = ids[ii];
	      if (this._isPending[id]) {
	        !this._isHandled[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id) : invariant(false) : undefined;
	        continue;
	      }
	      !this._callbacks[id] ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id) : invariant(false) : undefined;
	      this._invokeCallback(id);
	    }
	  };

	  /**
	   * Dispatches a payload to all registered callbacks.
	   */

	  Dispatcher.prototype.dispatch = function dispatch(payload) {
	    !!this._isDispatching ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
	    this._startDispatching(payload);
	    try {
	      for (var id in this._callbacks) {
	        if (this._isPending[id]) {
	          continue;
	        }
	        this._invokeCallback(id);
	      }
	    } finally {
	      this._stopDispatching();
	    }
	  };

	  /**
	   * Is this Dispatcher currently dispatching.
	   */

	  Dispatcher.prototype.isDispatching = function isDispatching() {
	    return this._isDispatching;
	  };

	  /**
	   * Call the callback stored with the given id. Also do some internal
	   * bookkeeping.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._invokeCallback = function _invokeCallback(id) {
	    this._isPending[id] = true;
	    this._callbacks[id](this._pendingPayload);
	    this._isHandled[id] = true;
	  };

	  /**
	   * Set up bookkeeping needed when dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._startDispatching = function _startDispatching(payload) {
	    for (var id in this._callbacks) {
	      this._isPending[id] = false;
	      this._isHandled[id] = false;
	    }
	    this._pendingPayload = payload;
	    this._isDispatching = true;
	  };

	  /**
	   * Clear bookkeeping used for dispatching.
	   *
	   * @internal
	   */

	  Dispatcher.prototype._stopDispatching = function _stopDispatching() {
	    delete this._pendingPayload;
	    this._isDispatching = false;
	  };

	  return Dispatcher;
	})();

	module.exports = Dispatcher;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28)))

/***/ },
/* 28 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	"use strict";

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function (condition, format, a, b, c, d, e, f) {
	  if (process.env.NODE_ENV !== 'production') {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
	        return args[argIndex++];
	      }));
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(28)))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _react = __webpack_require__(3);

	var _react2 = _interopRequireDefault(_react);

	var _storesCRUDStore = __webpack_require__(31);

	var _storesCRUDStore2 = _interopRequireDefault(_storesCRUDStore);

	var _actionsCRUDStoreActionCreators = __webpack_require__(34);

	var _actionsCRUDStoreActionCreators2 = _interopRequireDefault(_actionsCRUDStoreActionCreators);

	var _viewbuilderImageCoverViewBuilder = __webpack_require__(35);

	var _viewbuilderImageCoverViewBuilder2 = _interopRequireDefault(_viewbuilderImageCoverViewBuilder);

	var _viewbuilderTextCoverViewBuilder = __webpack_require__(40);

	var _viewbuilderTextCoverViewBuilder2 = _interopRequireDefault(_viewbuilderTextCoverViewBuilder);

	var _CRUDRelModal = __webpack_require__(7);

	var _CRUDRelModal2 = _interopRequireDefault(_CRUDRelModal);

	var _flux = __webpack_require__(26);

	exports["default"] = _react2["default"].createClass({
	  displayName: "CRUDHasManyEditor",

	  propTypes: {
	    /**
	     * The crud Id, which could be: "org", "users", "stores" ... etc
	     */
	    "crudId": _react2["default"].PropTypes.string.isRequired,
	    /**
	     * The baseUrl of a CRUD handler, usually "/bs"
	     */
	    "baseUrl": _react2["default"].PropTypes.string.isRequired,

	    /**
	     * The schema of the child records.
	     */
	    "schema": _react2["default"].PropTypes.object.isRequired,

	    /**
	     * Predefined parameters are used for creating new records
	     */
	    "predefined": _react2["default"].PropTypes.object,

	    /**
	     * The parent record of the children records
	     *
	     *    "references": {
	     *      "shop_id": {
	     *        "record": {{CRUD.Record.toArray()|json_encode|raw}},
	     *        "key": "id",
	     *        "referedRelationship": "images"
	     *      }
	     *    },
	     */
	    "references": _react2["default"].PropTypes.object.isRequired,

	    /**
	     * The description object of generating item view.
	     *
	     * Here is one example itemDesc config:
	     *
	     *    "itemDesc": {
	     *      "view": "TextView", // specify view type explicitly
	     *      "display": "float",
	     *      "coverImage": {
	     *        "field": ["thumb", "image"],
	     *        "width": 200,
	     *        "height": 100,
	     *        "backgroundSize": "cover"
	     *      }
	     *    },
	     *
	     */
	    "itemDesc": _react2["default"].PropTypes.object,

	    /**
	     * viewBuilder object to build the item views
	     */
	    "viewBuilder": _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.func, // view builder function name
	    _react2["default"].PropTypes.object // view builder instance
	    ]),

	    /**
	     * The parent action of this CRUDRelationApp editor
	     *
	     * Valid values are "create", "edit" or "update"
	     *
	     * @code
	     *
	     *     "parentAction": {% if CRUD.Record.id %}"edit"{% else %}"create"{% endif %},
	     *
	     * @code
	     */
	    "parentAction": _react2["default"].PropTypes.string.isRequired,

	    /**
	     * the load query
	     *
	     * @code
	     *
	     * load: { query: { ... } }
	     *
	     * @endcode
	     */
	    "load": _react2["default"].PropTypes.object,

	    /**
	     * config for delete action
	     *
	     *    "delete": {
	     *      "action": "App::Action::DeleteDShopImage",
	     *      "by": "id",
	     *      "confirm": "確認刪除?"
	     *    }
	     */
	    "delete": _react2["default"].PropTypes.object,

	    /**
	     * Event handlers
	     */
	    "onAddItem": _react2["default"].PropTypes.func,
	    "onEditItem": _react2["default"].PropTypes.func,
	    "onDeleteItem": _react2["default"].PropTypes.func
	  },

	  /******** @pragma BEGIN OF REACT COMPONENT METHODS *******/
	  getDefaultProps: function getDefaultProps() {
	    return {};
	  },

	  getInitialState: function getInitialState() {

	    // create a dispatcher object in each editor scope.
	    this.dispatcher = new _flux.Dispatcher();
	    var state = {};

	    // predefined the load behavior
	    // TODO: should we move the loader config to loadRecords action method?
	    this.store = new _storesCRUDStore2["default"](this.dispatcher, {
	      "baseUrl": this.props.baseUrl,
	      "params": this.buildReferenceParams({})
	    });
	    this.storeActionCreators = new _actionsCRUDStoreActionCreators2["default"](this.dispatcher);
	    state._records = [];
	    return state;
	  },

	  componentDidMount: function componentDidMount() {
	    this.store.addChangeListener(this.handleStoreChange);
	    // "update" or "edit" should trigger record loading.
	    if (this.props.parentAction != "create") {
	      this.storeActionCreators.loadRecords();
	    }
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.store.removeChangeListener(this.handleStoreChange);
	  },

	  /**
	   * This handler method is used for 
	   */
	  handleClickItem: function handleClickItem(item, e) {
	    e.preventDefault();
	  },

	  /******** @pragma PRIVATE METHODS *******/

	  /*
	   * Build query params from reference info.
	   *
	   * @param {object} predefinedParameters
	   */
	  buildReferenceParams: function buildReferenceParams(predefinedParameters) {
	    var params = _.extend({}, predefinedParameters || {});
	    if (this.props.references) {
	      for (var foreignKey in this.props.references) {
	        var referenceInfo = this.props.references[foreignKey];
	        params[foreignKey] = referenceInfo.record[referenceInfo.key];
	      }
	    }
	    return params;
	  },

	  /********** BINDING METHODS ***********/
	  handleStoreChange: function handleStoreChange() {
	    var records = this.store.objects();
	    this.setState({ '_records': records });
	  },

	  /**
	   * When user clicks on Add Item button.
	   *
	   * This handler uses title, baseUrl properties to create a modal
	   */
	  handleAddItem: function handleAddItem(e) {
	    e.preventDefault();

	    if (this.props.onAddItem) {
	      return this.props.onAddItem.call(this, e);
	    }

	    // The default behavior
	    var that = this;
	    var params = this.buildReferenceParams(this.props.predefined);
	    var defer = _CRUDRelModal2["default"].open("新增" + this.props.title, this.props.baseUrl + "/crud/edit", params);
	    defer.done(function (resp) {
	      if (resp.success && typeof resp.data !== "undefined") {
	        that.store.addRecord(resp.data);
	      } else {
	        console.error("failed to add record", resp);
	      }
	    });
	    defer.fail(function (resp) {});
	  },

	  handleEditItem: function handleEditItem(item, e) {
	    var _this = this;

	    e.preventDefault();

	    if (this.props.onEditItem) {
	      return this.props.onEditItem.call(this, item, e);
	    }

	    var that = this;
	    var params = this.buildReferenceParams();

	    if (this.props.schema.primaryKey) {
	      params[this.props.schema.primaryKey] = item[this.props.schema.primaryKey];
	    } else {
	      params.id = item.id;
	    }

	    var defer = _CRUDRelModal2["default"].open("編輯" + this.props.title, this.props.baseUrl + "/crud/edit", params);
	    defer.done(function (resp) {
	      if (resp.success && typeof resp.data !== "undefined") {
	        // Sometimes resp.data doesnt contains all fields
	        //   that.state.store.addRecord(resp.data);
	        _this.store.loadRecords(resp.data);
	      } else {
	        console.error("failed to add record", resp);
	      }
	    });
	    defer.fail(function (resp) {});
	  },

	  handleDeleteItem: function handleDeleteItem(item, e) {
	    var _this2 = this;

	    e.preventDefault();

	    if (this.props.onDeleteItem) {
	      return this.props.onDeleteItem.call(this, item, e);
	    }

	    // if we have existing record id
	    if (item.id) {
	      if (this.props["delete"] && this.props["delete"].action) {
	        (function () {
	          var byField = _this2.props["delete"].by || _this2.props.schema.primaryKey || 'id'; // default by id
	          var config = {};
	          var params = {};

	          if (typeof byField === "string") {
	            params[byField] = item[byField];
	          } else if (typeof byField === "array") {
	            byField.forEach(function (val, i) {
	              params[val] = item[val];
	            });
	          }
	          if (typeof _this2.props["delete"].confirm === "boolean" && _this2.props["delete"].confirm) {
	            config.confirm = '確認刪除';
	          } else if (typeof _this2.props["delete"].confirm === "string") {
	            config.confirm = _this2.props["delete"].confirm;
	          }

	          config.onSuccess = function (resp) {
	            // TODO: remove the item when success
	            _this2.store.removeRecord(item);
	          };
	          config.onError = function (resp) {};

	          runAction(_this2.props["delete"].action, params, config);
	        })();
	      } else {
	        console.warn("delete config is not defined.");
	      }
	    } else {
	      // it's a mock record for action to create
	    }
	  },

	  /**
	   * Create view builder from itemDesc
	   *
	   * @param {Object} itemDesc
	   */
	  createViewBuilder: function createViewBuilder(itemDesc) {
	    if (itemDesc.view) {
	      switch (itemDesc.view) {
	        case "TextCoverView":
	          return new _viewbuilderTextCoverViewBuilder2["default"](itemDesc);
	          break;
	        case "ImageCoverView":
	          return new _viewbuilderImageCoverViewBuilder2["default"](itemDesc);
	          break;
	      }
	    }
	    if (itemDesc.coverImage) {
	      return new _viewbuilderImageCoverViewBuilder2["default"](itemDesc);
	    } else if (itemDesc.title) {
	      return new _viewbuilderTextCoverViewBuilder2["default"](itemDesc);
	    }
	    return false;
	  },

	  /**
	   * When viewBuilder option is provided, we will use it instead of itemDesc.
	   *
	   * @return {React.Component}
	   */
	  render: function render() {
	    var itemDesc = this.props.itemDesc;
	    var viewBuilder = this.props.viewBuilder || this.props.viewbuilder;
	    // Convert function into object
	    if (typeof viewBuilder === "function") {
	      viewBuilder = new viewBuilder(this.props.itemDesc);
	    }
	    if (!viewBuilder) {
	      // Detect view builder type automatically
	      viewBuilder = this.createViewBuilder(itemDesc);
	      if (!viewBuilder) {
	        console.error("Can't create view builder for rendering records. Using default TextCoverView.");
	        viewBuilder = new _viewbuilderImageCoverViewBuilder2["default"](itemDesc);
	      }
	    }
	    return viewBuilder.render(this, this.state._records);
	  }
	});
	module.exports = exports["default"];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _CRUDBaseStore2 = __webpack_require__(32);

	var _CRUDBaseStore3 = _interopRequireDefault(_CRUDBaseStore2);

	var _constantsCRUDStoreActionIds = __webpack_require__(33);

	var _constantsCRUDStoreActionIds2 = _interopRequireDefault(_constantsCRUDStoreActionIds);

	var ActionTypes = _constantsCRUDStoreActionIds2["default"].ActionTypes;
	var EventEmitter = __webpack_require__(18).EventEmitter;
	var CHANGE_EVENT = 'change';

	/**
	 * CRUDStore defines the basic functions for CRUD
	 *
	 * Map Store
	 */

	var CRUDStore = (function (_CRUDBaseStore) {
	  _inherits(CRUDStore, _CRUDBaseStore);

	  /**
	   * @param {flux.Dispatcher} dispatcher
	   * @param {object} config { primaryKey:'id', url: '...', query: { ...search params... } }
	   */

	  function CRUDStore(dispatcher, config) {
	    var _this = this;

	    _classCallCheck(this, CRUDStore);

	    // console.log('CRUDStore', config);
	    _get(Object.getPrototypeOf(CRUDStore.prototype), "constructor", this).call(this, {
	      'primaryKey': config.primaryKey || 'id',
	      'page': 1,
	      'params': config.params || config.query,
	      'baseUrl': config.baseUrl || (config.url ? config.url.replace(/\/search$/, '') : null)
	    });
	    this.dispatchToken = dispatcher.register(function (action) {
	      switch (action.type) {
	        case ActionTypes.ADD_RECORD:
	          _this.addRecord(action.index, action.record);
	          break;
	        case ActionTypes.REMOVE_RECORD:
	          _this.removeRecord(action.index);
	          break;
	        case ActionTypes.LOAD_RECORDS:
	          _this.loadRecords();
	          break;
	        case ActionTypes.APPEND_RECORDS:
	          // TODO: fix me
	          // this.loadRecords();
	          break;
	      }
	    });
	  }

	  /**
	   * @param {string}
	   */

	  _createClass(CRUDStore, [{
	    key: "load",
	    value: function load(id) {}

	    /**
	     * Return all objects
	     */
	  }, {
	    key: "objects",
	    value: function objects() {
	      var objs = [];
	      for (var k in this.records) {
	        objs.push(this.records[k]);
	      }
	      return objs;
	    }
	  }, {
	    key: "keys",
	    value: function keys() {
	      return this.records.keys();
	    }

	    /**
	     * Check if a record exists.
	     */
	  }, {
	    key: "hasRecord",
	    value: function hasRecord(key) {
	      return this.records[key] ? true : false;
	    }

	    /**
	     * Load records into the store
	     *
	     * @deprecated
	     */
	  }, {
	    key: "loadRecords",
	    value: function loadRecords() {
	      var _this2 = this;

	      var primaryKey = this.getPrimaryKey();
	      this.records = {};

	      var url = this.getSearchUrl();
	      this.search(url, {}).done(function (records, done) {
	        var i = 0,
	            len = records.length;
	        for (; i < len; i++) {
	          var record = records[i];
	          var key = record[primaryKey];
	          _this2.records[key] = record;
	        }
	        done();
	      });
	    }

	    /**
	     * add one record to the store by it's primary key 
	     *
	     * @param {Object<Record>}
	     */
	  }, {
	    key: "addRecord",
	    value: function addRecord(record) {
	      var primaryKey = this.getPrimaryKey();
	      var key = record[primaryKey];
	      this.records[key] = record;
	      this.emitChangeEvent();
	    }

	    /**
	     * remove one record by the record object.
	     *
	     * @param {Object<Record>}
	     */
	  }, {
	    key: "removeRecord",
	    value: function removeRecord(record) {
	      var primaryKey = this.getPrimaryKey();
	      var key = record[primaryKey];
	      delete this.records[key];
	      this.emitChangeEvent();
	    }

	    /**
	     * Remove all records
	     */
	  }, {
	    key: "removeAll",
	    value: function removeAll() {
	      this.records = {};
	      this.emitChangeEvent();
	    }
	  }]);

	  return CRUDStore;
	})(_CRUDBaseStore3["default"]);

	exports["default"] = CRUDStore;
	module.exports = exports["default"];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var EventEmitter = __webpack_require__(18).EventEmitter;
	var CHANGE_EVENT = 'change';

	/**
	 * CRUDBaseStore defines the basic functions for CRUD
	 */

	var CRUDBaseStore = (function (_EventEmitter) {
	  _inherits(CRUDBaseStore, _EventEmitter);

	  /**
	   * config:
	   * - baseUrl: {string} a CRUD handler could be mount to any base url.
	   * - page: {number} the start page.
	   * - pageSize: {number} the page size.
	   * - params: {object} the default parameters that will be used in *every* request.
	   */

	  function CRUDBaseStore(config) {
	    _classCallCheck(this, CRUDBaseStore);

	    _get(Object.getPrototypeOf(CRUDBaseStore.prototype), 'constructor', this).call(this);
	    this.config = config;
	    // the default params that will be used in *every* request.
	    this.params = config.params || {};

	    // current page as a state.
	    this.currentPage = config.page || 1;
	    this.baseUrl = config.baseUrl;
	    this.records = {};
	  }

	  /**
	   * the search API doesn't change the data defined in the store, it returns a
	   * jQuery.Deferred object and you can setup a done callback on it.
	   *
	   * @param {Function} callback: (records, done) { done(); }
	   * @return {jQuery.Deferred}
	   */

	  _createClass(CRUDBaseStore, [{
	    key: 'search',
	    value: function search(_params) {
	      var _this = this;

	      var $deferred = jQuery.Deferred();
	      var params = this.buildParams(_params);
	      // console.log(this.getSearchUrl(), this.params, "_params", _params, params);
	      $.getJSON(this.getSearchUrl(), params, function (response) {
	        if (response instanceof Array) {
	          $deferred.resolve(response, _this.emitChangeEvent.bind(_this));
	        } else {
	          $deferred.reject(response);
	        }
	      });
	      return $deferred;
	    }
	  }, {
	    key: 'getPrimaryKey',
	    value: function getPrimaryKey() {
	      return this.config.primaryKey || 'id';
	    }
	  }, {
	    key: 'getSearchUrl',
	    value: function getSearchUrl() {
	      return this.baseUrl + "/search";
	    }

	    /**
	     * Switch page to {page}
	     *
	     * @param {number} page page number.
	     * @return {jQuery.Deferred}
	     */
	  }, {
	    key: 'page',
	    value: function page(_page) {
	      var _this2 = this;

	      var params = _.extend(this.params, {
	        page: this.currentPage,
	        pagenum: this.getPageSize()
	      });
	      $.getJSON(this.getSearchUrl(), params, function (response) {
	        if (response instanceof Array) {
	          $deferred.resolve(response, _this2.emitChangeEvent.bind(_this2));
	        } else {
	          $deferred.reject(response);
	        }
	      });
	      return $deferred;
	    }
	  }, {
	    key: 'getPageSize',
	    value: function getPageSize() {
	      return this.config.pageSize || 10;
	    }

	    /**
	     * Build request parameters
	     *
	     * merge the default parameters and the overrides.
	     */
	  }, {
	    key: 'buildParams',
	    value: function buildParams(_params) {
	      // create new parameters based on predefined params and override parameters
	      return _.extend(this.params || {}, _params);
	    }
	  }, {
	    key: 'buildReferenceParams',
	    value: function buildReferenceParams(references, predefinedParameters) {
	      var params = _.extend({}, predefinedParameters || {});
	      for (var foreignKey in references) {
	        var refInfo = references[foreignKey];
	        params[foreignKey] = refInfo.record[referenceInfo.key];
	      }
	      return params;
	    }

	    /********************************************
	     * event related methods
	     ********************************************/
	  }, {
	    key: 'emitChangeEvent',
	    value: function emitChangeEvent() {
	      this.emit(CHANGE_EVENT);
	    }
	  }, {
	    key: 'addChangeListener',
	    value: function addChangeListener(callback) {
	      this.on(CHANGE_EVENT, callback);
	    }
	  }, {
	    key: 'removeChangeListener',
	    value: function removeChangeListener(callback) {
	      this.removeListener(CHANGE_EVENT, callback);
	    }
	  }]);

	  return CRUDBaseStore;
	})(EventEmitter);

	exports['default'] = CRUDBaseStore;
	module.exports = exports['default'];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var keyMirror = __webpack_require__(17);

	// Define action constants
	module.exports = {
	  "ActionTypes": keyMirror({

	    // add the specific record.
	    ADD_RECORD: null,

	    // remove the specific record.
	    REMOVE_RECORD: null,

	    // load the records from the current query.
	    LOAD_RECORDS: null,

	    // load more records and append on the end of the list by using push.apply
	    APPEND_RECORDS: null
	  })
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ActionTypes = __webpack_require__(33).ActionTypes;

	var CRUDStoreActionCreators = (function () {
	  function CRUDStoreActionCreators(dispatcher) {
	    _classCallCheck(this, CRUDStoreActionCreators);

	    this.dispatcher = dispatcher;
	  }

	  _createClass(CRUDStoreActionCreators, [{
	    key: "loadRecords",
	    value: function loadRecords(records) {
	      this.dispatcher.dispatch({ "type": ActionTypes.LOAD_RECORDS });
	    }
	  }, {
	    key: "addRecord",
	    value: function addRecord(index, record) {
	      this.dispatcher.dispatch({
	        "type": ActionTypes.ADD_RECORD,
	        "index": index,
	        "record": record
	      });
	    }
	  }, {
	    key: "removeRecord",
	    value: function removeRecord(index) {
	      this.dispatcher.dispatch({
	        "type": ActionTypes.REMOVE_RECORD,
	        "index": index
	      });
	    }
	  }]);

	  return CRUDStoreActionCreators;
	})();

	exports["default"] = CRUDStoreActionCreators;
	module.exports = exports["default"];

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _viewbuilderBaseViewBuilder = __webpack_require__(36);

	var _viewbuilderBaseViewBuilder2 = _interopRequireDefault(_viewbuilderBaseViewBuilder);

	var _utilsUri = __webpack_require__(37);

	var _utilsUri2 = _interopRequireDefault(_utilsUri);

	var _utilsCss = __webpack_require__(38);

	var _utilsCss2 = _interopRequireDefault(_utilsCss);

	var _classnames = __webpack_require__(39);

	var _classnames2 = _interopRequireDefault(_classnames);

	var ImageCoverViewBuilder = (function (_BaseViewBuilder) {
	  _inherits(ImageCoverViewBuilder, _BaseViewBuilder);

	  function ImageCoverViewBuilder() {
	    _classCallCheck(this, ImageCoverViewBuilder);

	    _get(Object.getPrototypeOf(ImageCoverViewBuilder.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(ImageCoverViewBuilder, [{
	    key: "_renderImageView",

	    /**
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     */
	    value: function _renderImageView(target, record) {
	      var itemDesc = this.itemDesc;
	      var imageUrl = this._findRecordFieldValue(record, itemDesc.coverImage.field);
	      var style = {
	        // FIXME: remove this leading slash
	        'backgroundImage': _utilsCss2["default"].url("/" + imageUrl),
	        'backgroundSize': itemDesc.coverImage.backgroundSize || 'cover',
	        'backgroundPosition': 'center center',
	        'backgroundRepeat': 'no-repeat',
	        'width': (itemDesc.coverImage.width || this.defaultWidth) + 'px',
	        'height': (itemDesc.coverImage.height || this.defaultHeight) + 'px'
	      };
	      return React.createElement(
	        "div",
	        { key: "coverImage",
	          onClick: target.handleClickItem.bind(target, record),
	          style: style },
	        " "
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} target
	     */
	  }, {
	    key: "renderAddView",
	    value: function renderAddView(target) {
	      var itemDesc = this.itemDesc;
	      var boxStyle = {
	        'width': (itemDesc.coverImage.width || this.defaultWidth) + 'px',
	        'height': (itemDesc.coverImage.height || this.defaultHeight) + 'px',
	        'lineHeight': (itemDesc.coverImage.height || this.defaultHeight) + 'px',
	        'textAlign': 'center'
	      };
	      var classes = (0, _classnames2["default"])({
	        "crud-record-item": true,
	        "add": true,
	        "float": itemDesc.display === 'float',
	        "block": itemDesc.display === "block",
	        "inline-block": itemDesc.display === "inline-block"
	      });
	      return React.createElement(
	        "div",
	        { className: classes, key: "add", onClick: target.handleAddItem },
	        React.createElement(
	          "div",
	          { style: boxStyle },
	          React.createElement(
	            "i",
	            { className: "fa fa-plus" },
	            " "
	          )
	        )
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     * @param {string} string
	     */
	  }, {
	    key: "renderRecord",
	    value: function renderRecord(target, record, key) {
	      var childViews = [];

	      if (this.itemDesc.coverImage) {
	        var image = this._renderImageView(target, record);
	        childViews.push(image);
	      }

	      if (this.itemDesc.title) {
	        var title = this._findRecordFieldValue(record, this.itemDesc.title.field) || "Untitled";
	        // itemDesc.title
	        childViews.push(React.createElement(
	          "div",
	          { key: "title", className: "title" },
	          title
	        ));
	      }

	      if (target.props["delete"]) {
	        var btn = this.renderRemoveIconButton(target, record);
	        childViews.push(btn);
	      }

	      if (target.props.references && target.props.schema) {
	        var inputs = this._renderItemSignatureInputs(target, record);
	        childViews.push(inputs);
	      }

	      if (this.itemDesc.controls) {
	        childViews.push(React.createElement(
	          "div",
	          { key: "controls", className: "pull-right controls" },
	          this.renderItemControls(target, record, this.itemDesc.controls)
	        ));
	      }

	      var classes = (0, _classnames2["default"])({
	        "crud-record-item": true,
	        "crud-record-item-cover": true,
	        "float": this.itemDesc.display === 'float',
	        "block": this.itemDesc.display === "block",
	        "inline-block": this.itemDesc.display === "inline-block"
	      });
	      return React.createElement(
	        "div",
	        { className: classes, key: key },
	        childViews
	      );
	    }
	  }]);

	  return ImageCoverViewBuilder;
	})(_viewbuilderBaseViewBuilder2["default"]);

	exports["default"] = ImageCoverViewBuilder;
	module.exports = exports["default"];

/***/ },
/* 36 */
/***/ function(module, exports) {

	

	/**
	 * BaseViewBuilder generates record view dynamically from pre-defined item
	 * description.
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var BaseViewBuilder = (function () {
	  /**
	   * @param {object} itemDesc
	   */

	  function BaseViewBuilder(itemDesc) {
	    _classCallCheck(this, BaseViewBuilder);

	    this.itemDesc = itemDesc;
	  }

	  /**
	   * Render header for items (each page)
	   */

	  _createClass(BaseViewBuilder, [{
	    key: 'renderHeader',
	    value: function renderHeader() {}

	    /**
	     * Render footer for items (each page)
	     */
	  }, {
	    key: 'renderFooter',
	    value: function renderFooter() {}

	    /**
	     * Render record with itemDesc's spec
	     *
	     * @param {object} record
	     * @param {object} config
	     * @return {string}
	     */
	  }, {
	    key: 'renderFieldWithSpec',
	    value: function renderFieldWithSpec(record, config) {
	      if (config.field) {
	        return this._findRecordFieldValue(record, config.field) || config.defaultValue;
	      } else if (config.format) {
	        return this._renderFormat(record, config.format);
	      }
	      return '';
	    }

	    /**
	     * Render record field value with format string
	     *
	     * @param {object} record
	     * @param {string} format
	     * @return {string}
	     */
	  }, {
	    key: '_renderFormat',
	    value: function _renderFormat(record, format) {
	      var _this = this;

	      return format.replace(/{(\w+)}/g, function (all, capturedField) {
	        return _this._findRecordFieldValue(record, capturedField);
	      });
	    }

	    /**
	     * Return the field value by checking each field name.
	     *
	     * @param {object} record
	     * @param {Array|string} fields
	     * @return {mixed}
	     */
	  }, {
	    key: '_findRecordFieldValue',
	    value: function _findRecordFieldValue(record, fields) {
	      if (typeof fields === "string") {
	        return record[fields];
	      } else if (fields instanceof Array) {
	        for (var i = 0; i < fields.length; i++) {
	          var field = fields[i];
	          if (record[field]) {
	            return record[field];
	          }
	        }
	      } else {
	        console.error('fields', fields, ' is not defined in record', record);
	      }
	    }

	    /**
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     */
	  }, {
	    key: 'renderEditButton',
	    value: function renderEditButton(target, record) {
	      return React.createElement(
	        'button',
	        { key: 'btn-edit', className: 'btn btn-primary btn-sm',
	          onClick: target.handleEditItem.bind(target, record) },
	        '編輯'
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     */
	  }, {
	    key: 'renderDeleteButton',
	    value: function renderDeleteButton(target, record) {
	      return React.createElement(
	        'button',
	        { key: 'btn-delete', className: 'btn btn-primary btn-sm',
	          onClick: target.handleDeleteItem.bind(target, record) },
	        '刪除'
	      );
	    }

	    /**
	     * Render controls in btn-group
	     *
	     * There are 2 built-in actions right now:
	     *
	     * 'edit' edit the record
	     * 'delete' delete the record
	     *
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     * @param {Array} controls itemDesc.controls spec
	     */
	  }, {
	    key: 'renderItemControls',
	    value: function renderItemControls(target, record, controls) {
	      var _this2 = this;

	      return React.createElement(
	        'div',
	        { className: 'btn-group' },
	        controls ? controls.map(function (control, i) {
	          switch (control.action || control.feature) {
	            case "edit":
	              return _this2.renderEditButton(target, record);
	            case "delete":
	              return _this2.renderDeleteButton(target, record);
	          }
	        }) : null
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     */
	  }, {
	    key: 'renderRemoveIconButton',
	    value: function renderRemoveIconButton(target, record) {
	      var itemDesc = this.itemDesc;
	      return React.createElement(
	        'div',
	        { key: 'removeBtn', className: 'remove-btn', onClick: target.handleDeleteItem.bind(target, record) },
	        React.createElement(
	          'i',
	          { className: 'fa fa-times-circle' },
	          ' '
	        )
	      );
	    }

	    /**
	     * _buildItemSignatureInputs builds the hidden input fields for 
	     * the inserted new record. (only one record for each call)
	     *
	     * ActionKit will handle the record signature.
	     *
	     * @param {CRUDHasManyEditor} target
	     * @param {object} record
	     */
	  }, {
	    key: '_renderItemSignatureInputs',
	    value: function _renderItemSignatureInputs(target, record) {
	      var itemDesc = this.itemDesc;
	      var inputs = [];
	      var schema = target.props.schema;
	      var references = target.props.references;
	      var pk = schema.primaryKey;

	      if (!pk) {
	        return console.error("itemDesc.primaryKey is not defined.");
	      }

	      var signatureId = record[pk];

	      // build the reset reference field
	      if (references) {
	        for (var foreignKey in references) {
	          var referenceInfo = references[foreignKey];
	          var inputValue = referenceInfo.record[referenceInfo.key];
	          var inputName = "{relationship}[{signature}][{foreignKey}]".replace('{relationship}', referenceInfo.referedRelationship).replace('{signature}', signatureId).replace('{foreignKey}', foreignKey);
	          inputs.push(React.createElement('input', { key: foreignKey, type: 'hidden', name: inputName, defaultValue: inputValue }));

	          // build the primary key field for the item
	          var inputName = "{relationship}[{signature}][{foreignKey}]".replace('{relationship}', referenceInfo.referedRelationship).replace('{signature}', signatureId).replace('{foreignKey}', pk);
	          inputs.push(React.createElement('input', { key: pk, type: 'hidden', name: inputName, defaultValue: signatureId }));
	        }
	      }
	      return inputs;
	    }

	    /**
	     * This method could be overridded to render a wrapper around the records.
	     *
	     * @param {CRUDHasManyEditor} target
	     * @param {Array<object>} records
	     */
	  }, {
	    key: 'renderRecords',
	    value: function renderRecords(target, records) {
	      return records.map(this.renderRecord.bind(this, target));
	    }

	    /**
	     * This method could be overridded to render a wrapper around the records.
	     *
	     * @param {CRUDHasManyEditor} target
	     * @param {Array<object>} records
	     */
	  }, {
	    key: 'render',
	    value: function render(target, records) {
	      var addView = this.itemDesc.add !== false ? this.renderAddView(target) : null;
	      return React.createElement(
	        'div',
	        { className: 'crud-record-item-container clearfix' },
	        this.renderHeader(),
	        this.renderRecords(target, records),
	        this.renderFooter(),
	        addView
	      );
	    }
	  }]);

	  return BaseViewBuilder;
	})();

	exports['default'] = BaseViewBuilder;
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	module.exports.fixedEncodeURIComponent = function (str) {
	  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16);
	  });
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var _uri = __webpack_require__(37);

	var _uri2 = _interopRequireDefault(_uri);

	module.exports = {
	  "url": function url(_url) {
	    return 'url(' + _url.split('/').map(_uri2["default"].fixedEncodeURIComponent).join('/') + ')';
	  },
	  "backgroundSize": function backgroundSize(d) {
	    if (typeof d === "object") {
	      return d.width + ' ' + d.height;
	    }
	    if (typeof d === "string") {
	      return d;
	    }
	    return "contain";
	  }
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _viewbuilderBaseViewBuilder = __webpack_require__(36);

	var _viewbuilderBaseViewBuilder2 = _interopRequireDefault(_viewbuilderBaseViewBuilder);

	var _utilsUri = __webpack_require__(37);

	var _utilsUri2 = _interopRequireDefault(_utilsUri);

	var _utilsCss = __webpack_require__(38);

	var _utilsCss2 = _interopRequireDefault(_utilsCss);

	var _classnames = __webpack_require__(39);

	var _classnames2 = _interopRequireDefault(_classnames);

	/*
	The TextCoverView item description could be very complex like the code below:

	The keys are placeholder, you define the mapping record field to fill these
	placeholder designed in this view template.

	  "itemDesc": {
	    "view": "TextCoverView",
	    "display": "block",
	    "title": { "field": "title" },
	    "subtitle": {
	      "format": "起跑地點: {start_location}  起跑時間: {start_time}",
	    },
	    "desc": { "field": "description" },
	    "footer": {
	      "columns": [
	        { "text": { 'format': '費用 {fee}' } },
	        { "text": { 'format': '距離 {distance}' } },
	      ]
	    }
	  }
	*/

	var TextCoverViewBuilder = (function (_BaseViewBuilder) {
	  _inherits(TextCoverViewBuilder, _BaseViewBuilder);

	  function TextCoverViewBuilder() {
	    _classCallCheck(this, TextCoverViewBuilder);

	    _get(Object.getPrototypeOf(TextCoverViewBuilder.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(TextCoverViewBuilder, [{
	    key: "renderTags",

	    /**
	     * Render tags
	     *
	     * @param {CRUDHasManyEditor}
	     * @param {object}
	     * @param {Array|string}
	     */
	    value: function renderTags(target, record, tags) {
	      var _this = this;

	      if (tags instanceof Array) {
	        return tags.map(function (tag, tagIdx) {
	          return React.createElement(
	            "span",
	            { key: tagIdx, className: "tag" },
	            _this.renderFieldWithSpec(record, tag)
	          );
	        });
	      } else if (typeof tags === "string") {
	        return React.createElement(
	          "span",
	          { className: "tag" },
	          this.renderFieldWithSpec(record, tag)
	        );
	      }
	    }
	  }, {
	    key: "renderItemHeader",
	    value: function renderItemHeader(target, record, title, subtitle) {
	      return React.createElement(
	        "div",
	        { key: "header", className: "item-header" },
	        React.createElement(
	          "a",
	          { key: "title", onClick: target.handleClickItem.bind(target, record), className: "title" },
	          this.renderFieldWithSpec(record, title)
	        ),
	        React.createElement(
	          "div",
	          { key: "subtitle", className: "subtitle" },
	          this.renderFieldWithSpec(record, subtitle)
	        )
	      );
	    }
	  }, {
	    key: "renderDateLabel",
	    value: function renderDateLabel(target, record, dateSpec) {
	      var datestr = this._findRecordFieldValue(record, dateSpec.field);
	      if (!datestr && dateSpec.show_empty) {
	        datestr = "----/--/-- --:--";
	      }
	      if (datestr) {
	        return React.createElement(
	          "div",
	          { key: "date-label", className: "date-label" },
	          "On ",
	          React.createElement(
	            "span",
	            { className: "date" },
	            datestr
	          )
	        );
	      }
	      return null;
	    }

	    /**
	     * Render footer component
	     *
	     * @param {CRUDHasManyEditor}
	     * @param {object}
	     * @param {object} footerSpec
	     * @param {Array} controls
	     */
	  }, {
	    key: "renderItemFooter",
	    value: function renderItemFooter(target, record, footerSpec, controls) {
	      var _this2 = this;

	      var columns = [];
	      if (typeof footerSpec.columns !== "undefined" && footerSpec.columns instanceof Array) {
	        footerSpec.columns.forEach(function (col, i) {
	          if (col.text) {
	            columns.push(React.createElement(
	              "div",
	              { className: "column", key: i },
	              _this2.renderFieldWithSpec(record, col.text)
	            ));
	          } else if (col.tags) {
	            columns.push(React.createElement(
	              "div",
	              { className: "column", key: i },
	              _this2.renderTags(target, record, col.tags)
	            ));
	          }
	        });
	      }

	      if (controls && controls instanceof Array) {
	        columns.push(React.createElement(
	          "div",
	          { key: "controls", className: "pull-right controls" },
	          this.renderItemControls(target, record, controls)
	        ));
	      }

	      return React.createElement(
	        "div",
	        { key: "footer", className: "item-footer clearfix" },
	        columns
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} target
	     */
	  }, {
	    key: "renderAddView",
	    value: function renderAddView(target) {
	      var itemDesc = this.itemDesc;
	      var boxStyle = {
	        'height': '50px',
	        'lineHeight': '50px',
	        'textAlign': 'center'
	      };
	      var classes = (0, _classnames2["default"])({
	        "crud-record-item": true,
	        "add": true,
	        "is": true,
	        "text-cover": true,
	        "float": itemDesc.display === 'float',
	        "block": itemDesc.display === "block",
	        "inline-block": itemDesc.display === "inline-block"
	      });
	      return React.createElement(
	        "div",
	        { className: classes, key: "add", onClick: target.handleAddItem },
	        React.createElement(
	          "div",
	          { style: boxStyle },
	          React.createElement(
	            "i",
	            { className: "fa fa-plus" },
	            " "
	          )
	        )
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} record
	     * @param {object} record
	     * @param {key} string
	     */
	  }, {
	    key: "renderRecord",
	    value: function renderRecord(target, record, key) {
	      var _tmp;
	      var childViews = [];

	      if (target.props["delete"]) {
	        var btn = this.renderRemoveIconButton(target, record);
	        childViews.push(btn);
	      }

	      if (this.itemDesc.date) {
	        if (_tmp = renderDateLabel(target, record, this.itemDesc.date)) {
	          childViews.push(label);
	        }
	      }

	      if (this.itemDesc.title || this.itemDesc.subtitle) {
	        childViews.push(this.renderItemHeader(target, record, this.itemDesc.title, this.itemDesc.subtitle));
	      }

	      if (this.itemDesc.desc) {
	        childViews.push(React.createElement(
	          "div",
	          { key: "desc", className: "item-desc" },
	          this.renderFieldWithSpec(record, this.itemDesc.desc)
	        ));
	      }

	      if (this.itemDesc.footer) {
	        if (_tmp = this.renderItemFooter(target, record, this.itemDesc.footer, this.itemDesc.controls)) {
	          childViews.push(_tmp);
	        }
	      }

	      if (target.props.references && target.props.schema) {
	        if (_tmp = this._renderItemSignatureInputs(target, record)) {
	          childViews.push(_tmp);
	        }
	      }

	      var classes = (0, _classnames2["default"])({
	        "crud-record-item": true,
	        "is": true,
	        "text-cover": true,
	        "float": this.itemDesc.display === 'float',
	        "block": this.itemDesc.display === "block",
	        "inline-block": this.itemDesc.display === "inline-block"
	      });
	      return React.createElement(
	        "div",
	        { className: classes, key: key },
	        childViews
	      );
	    }
	  }]);

	  return TextCoverViewBuilder;
	})(_viewbuilderBaseViewBuilder2["default"]);

	exports["default"] = TextCoverViewBuilder;
	module.exports = exports["default"];

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _viewbuilderBaseViewBuilder = __webpack_require__(36);

	var _viewbuilderBaseViewBuilder2 = _interopRequireDefault(_viewbuilderBaseViewBuilder);

	var _utilsUri = __webpack_require__(37);

	var _utilsUri2 = _interopRequireDefault(_utilsUri);

	var _utilsCss = __webpack_require__(38);

	var _utilsCss2 = _interopRequireDefault(_utilsCss);

	var _classnames = __webpack_require__(39);

	var _classnames2 = _interopRequireDefault(_classnames);

	var TableViewBuilder = (function (_BaseViewBuilder) {
	  _inherits(TableViewBuilder, _BaseViewBuilder);

	  function TableViewBuilder() {
	    _classCallCheck(this, TableViewBuilder);

	    _get(Object.getPrototypeOf(TableViewBuilder.prototype), "constructor", this).apply(this, arguments);
	  }

	  _createClass(TableViewBuilder, [{
	    key: "renderAddView",

	    /**
	     * @param {CRUDHasManyEditor} target
	     */
	    value: function renderAddView(target) {
	      var itemDesc = this.itemDesc;
	      var boxStyle = {
	        'height': '50px',
	        'lineHeight': '50px',
	        'textAlign': 'center'
	      };
	      var classes = (0, _classnames2["default"])({
	        "crud-record-item": true,
	        "add": true,
	        "is": true,
	        "text-cover": true,
	        "float": itemDesc.display === 'float',
	        "block": itemDesc.display === "block",
	        "inline-block": itemDesc.display === "inline-block"
	      });
	      return React.createElement(
	        "div",
	        { className: classes, key: "add", onClick: target.handleAddItem },
	        React.createElement(
	          "div",
	          { style: boxStyle },
	          React.createElement(
	            "i",
	            { className: "fa fa-plus" },
	            " "
	          )
	        )
	      );
	    }
	  }, {
	    key: "renderHeader",
	    value: function renderHeader(target) {
	      var headers = [];
	      return React.createElement(
	        "thead",
	        null,
	        React.createElement(
	          "tr",
	          null,
	          this.itemDesc.columns.map(function (el, i) {
	            return React.createElement(
	              "th",
	              { key: i },
	              el.label
	            );
	          }),
	          React.createElement(
	            "th",
	            { key: "controls" },
	            "-"
	          )
	        )
	      );
	    }
	  }, {
	    key: "renderRecords",
	    value: function renderRecords(target, records) {
	      return React.createElement(
	        "tbody",
	        null,
	        _get(Object.getPrototypeOf(TableViewBuilder.prototype), "renderRecords", this).call(this, target, records)
	      );
	    }
	  }, {
	    key: "renderFooter",
	    value: function renderFooter(target) {
	      var addView = this.itemDesc.add !== false ? this.renderAddView(target) : null;
	      if (!addView) {
	        return null;
	      }
	      return React.createElement(
	        "tfoot",
	        null,
	        React.createElement(
	          "tr",
	          null,
	          React.createElement(
	            "td",
	            { colSpan: this.itemDesc.columns.length + 1 },
	            addView
	          )
	        )
	      );
	    }

	    /**
	     * @param {CRUDHasManyEditor} record
	     * @param {object} record
	     * @param {key} string
	     */
	  }, {
	    key: "renderRecord",
	    value: function renderRecord(target, record, key) {

	      var formFields;
	      if (target.props.references && target.props.schema) {
	        formFields = this._renderItemSignatureInputs(target, record);
	      }

	      return React.createElement(
	        "tr",
	        { key: key },
	        this.itemDesc.columns.map(function (col, i) {
	          var keys = col.key.split(/\./);
	          var k = undefined;
	          var v = record;
	          while ((k = keys.shift()) && v) {
	            v = v[k];
	          }

	          if (col.formatter && col.formatter instanceof Function) {
	            v = col.formatter(v);
	          }

	          // Render form fields
	          return React.createElement(
	            "td",
	            { key: i },
	            React.createElement(
	              "span",
	              { style: col.style },
	              v
	            )
	          );
	        }),
	        React.createElement(
	          "td",
	          { key: "controls" },
	          this.renderItemControls(target, record, this.itemDesc.controls || []),
	          formFields
	        )
	      );
	    }

	    /**
	     * This method could be overridded to render a wrapper around the records.
	     *
	     * @param {CRUDHasManyEditor} target
	     * @param {Array<object>} records
	     */
	  }, {
	    key: "render",
	    value: function render(target, records) {
	      return React.createElement(
	        "table",
	        { className: "table table-strip" },
	        this.renderHeader(target),
	        this.renderRecords(target, records),
	        this.renderFooter(target)
	      );
	    }
	  }]);

	  return TableViewBuilder;
	})(_viewbuilderBaseViewBuilder2["default"]);

	exports["default"] = TableViewBuilder;
	module.exports = exports["default"];

/***/ }
/******/ ]);