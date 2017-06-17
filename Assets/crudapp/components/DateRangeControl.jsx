var React = require('react');

export default React.createClass({

  getInitialState: function() {
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

  handleStartDateChange: function(e, datestr) {
    if (!datestr) {
      var input = ReactDOM.findDOMNode(this.refs.fromDateInput);
      datestr = input.value;
    }
    jQuery.cookie("dateRangeFrom", datestr);
    this.setState({ "from": datestr});
  },

  handleEndDateChange: function(e, datestr) {
    if (!datestr) {
      var input = ReactDOM.findDOMNode(this.refs.toDateInput);
      datestr = input.value;
    }
    jQuery.cookie("dateRangeTo", datestr);
    this.setState({ "to": datestr });
  },

  handleRangeTypeChange: function(e) {
    // update cookie
    jQuery.cookie("dateRangeType", e.target.value);
    this.setState({
      "rangeType": e.target.value
    });
  },


  initDatePicker: function() {
    var that = this;
    if (this.state.rangeType == 'custom') {
      var from = ReactDOM.findDOMNode(this.refs.fromDateInput);
      var to = ReactDOM.findDOMNode(this.refs.toDateInput);

      $(from).datepicker({
        dateFormat: 'yy/mm/dd',
        changeMonth: true,
        changeYear: true,
        maxDate: '0',
        onSelect: function(datestr, ui) {
          that.handleStartDateChange(null,datestr);
        }
      });
      $(to).datepicker({
        dateFormat: 'yy/mm/dd',
        changeMonth: true,
        changeYear: true,
        maxDate: '0',
        onSelect: function(datestr, ui) {
          that.handleEndDateChange(null,datestr);
        }
      });
    }
  },
  componentDidMount: function(e) {
    this.initDatePicker();
  },
  componentDidUpdate: function(e) {
    this.initDatePicker();
  },
  render: function() {

    /*
    for (var i = 0 ; i < options.length ; i++) {
        if (options[i].value == this.props.rangeType) {
            options[i].selected = true;
        }
    }
    */

    var dateFrom = [];

    if (this.props.allowPeriodColumnOption) {
      dateFrom.push(
        <span key="period-column">
          <select ref="periodColumnType" id="period-column"
                name="period-column" 
                className="form-control"
                defaultValue={this.props.allowPeriodColumnOption || "sale_period_at"}>
            <option value="sale_period_at">營業日</option>
            <option value="transaction_created_at">交易日</option>
          </select>
        </span>
      );
    }

    var options = [];
    // options.push(<option value={'recent30day'}>最近 30 天</option>);
    options.push(<option key={'recent7day'} value={'recent7day'}>最近 7 天</option>);
    options.push(<option key={'recent1month'} value={'recent1month'}>最近 1 個月</option>);
    options.push(<option key={'day'} value={'day'}>單日</option>);
    options.push(<option key={'custom'} value={'custom'}>自訂</option>);
    dateFrom.push(
      <select key="date-range-type" id="date-range-type" name="date-range-type" className="form-control"
          defaultValue={this.state.rangeType}
          onChange={this.handleRangeTypeChange}>
        {options}
      </select>
    );



    if (this.state.rangeType == 'custom') {
      dateFrom.push(<span key="custom-date-range">
              <label htmlFor="date-range-from">起日</label>
              <input ref="fromDateInput" id="date-range-from"
                    name="date-range-from"
                    className="form-control datepicker"
                    size={12}
                    defaultValue={this.state.from} onChange={this.handleStartDateChange}/>

              <label htmlFor="date-range-to">迄日</label>
              <input ref="toDateInput" id="date-range-to"
                    name="date-range-to" 
                    className="form-control datepicker" 
                    size={12}
                    defaultValue={this.state.to} onChange={this.handleEndDateChange}/>
        </span>
      );
    } else if (this.state.rangeType == 'day') {
      dateFrom.push(<span key="custom-date-single">
        <label htmlFor="date-range-from">日期</label>
        <input ref="fromDateInput" id="date-range-from"
              name="date-range-from" className="form-control datepicker"
              size={12}
              defaultValue={this.state.from} onChange={this.handleStartDateChange}/>
        </span>
      );
    }

    return (
      <div>
        {dateFrom}
      </div>
    );
  }
});
