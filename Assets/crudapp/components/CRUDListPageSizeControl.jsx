

var React = require('react');

export default React.createClass({

  propTypes: function() {
    return {
      "pageSize": React.PropTypes.string.isRequired
    };
  },

  getInitialState: function() {
    return {
      "pageSize": this.props.pageSize
    };
  },

  handleChange: function(e) {
    var pageSize = ReactDOM.findDOMNode(this.refs.sizeSelect).value;

    // when page size is updated, update the pagination component
    this.props.context.actionCreators.changePageSize(pageSize);
  },

  render: function() {
    var options = [];
    if (this.props.availableSizes) {
      options = this.props.availableSizes.map(function(s) {
        return <option key={s} value={s}>{s}</option>;
      });
    } else {
      options.push(<option key={10} value={10}>10</option>);
      options.push(<option key={20} value={20}>20</option>);
      options.push(<option key={50} value={50}>50</option>);
    }
    return (
      <div className="form-group">
            <label>每頁顯示
            <select ref="sizeSelect" className="form-control" 
                defaultValue={this.state.pageSize} 
                onChange={this.handleChange}>
                {options}
            </select>
            筆
            </label>
        </div>
    );
  }
});
