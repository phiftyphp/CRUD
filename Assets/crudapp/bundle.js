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

	'use strict';

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _crudappComponentsSetPasswordControl = __webpack_require__(1);

	var _crudappComponentsSetPasswordControl2 = _interopRequireDefault(_crudappComponentsSetPasswordControl);

	var _crudappComponentsDateRangeControl = __webpack_require__(3);

	var _crudappComponentsDateRangeControl2 = _interopRequireDefault(_crudappComponentsDateRangeControl);

	var _crudappComponentsSingleDayControl = __webpack_require__(4);

	var _crudappComponentsSingleDayControl2 = _interopRequireDefault(_crudappComponentsSingleDayControl);

	window.SetPasswordControl = _crudappComponentsSetPasswordControl2['default'];
	window.DateRangeControl = _crudappComponentsDateRangeControl2['default'];
	window.SingleDayControl = _crudappComponentsSingleDayControl2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var React = __webpack_require__(2);
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
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var React = __webpack_require__(2);
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
	      { id: 'date-range-type', name: 'date-range-type', className: 'form-control',
	        defaultValue: this.state.rangeType,
	        onChange: this.handleRangeTypeChange },
	      options
	    ));

	    if (this.state.rangeType == 'custom') {
	      dateFrom.push(React.createElement(
	        'span',
	        { key: 'custom-date' },
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
	        { key: 'custom-date' },
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @jsx React.DOM
	 */
	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var React = __webpack_require__(2);
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

/***/ }
/******/ ]);