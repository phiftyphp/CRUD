/**
 * @jsx React.DOM
 */
var React = require('react');
export default React.createClass({
  getInitialState: function() {
    return {
      "from": this.props.from || jQuery.cookie("dateRangeFrom") || new Date().toJSON().slice(0,10),
    };
  },

  handleStartDateChange: function(e, datestr) {
    if (!datestr) {
      var input = ReactDOM.findDOMNode(this.refs.fromDateInput);
      datestr = input.value;
    }
    jQuery.cookie("dateRangeFrom", datestr);
    this.setState({ "from": datestr });
  },

  initDatePicker: function() {
    var that = this;
    var from = ReactDOM.findDOMNode(this.refs.fromDateInput);
    jQuery(from).datepicker({
      dateFormat: 'yy/mm/dd',
      changeMonth: true,
      changeYear: true,
      maxDate: '0',
      onSelect: function(datestr, ui) {
        that.handleStartDateChange(null, datestr);
      }
    });
  },
  componentDidMount: function(e) {
    this.initDatePicker();
  },
  componentDidUpdate: function(e) {
    this.initDatePicker();
  },
  render: function() {
    return (
      <div>
        <input type="hidden" id="date-range-type" name="date-range-type" value="day"/>
        <label htmlFor="start-at">營業日</label>
        <input id="start-at" name="start-at" 
          ref="fromDateInput" className="form-control datepicker" 
          size={12}
          onChange={this.handleStartDateChange}
          defaultValue={this.state.from}/>
      </div>
    );
  }
});
