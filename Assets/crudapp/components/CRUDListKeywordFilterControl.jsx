
var React = require('react');

export default React.createClass({
  getInitialState: function() {
    return {};
  },

  handleChange: function(e) {
    this.props.context.actionCreators.applyFilter("_q", e.target.value);
  },

  render: function() {
    return (
      <div className="form-group">
        <input className="form-control"
          type="text" 
          placeholder={this.props.placeholder}
          onChange={this.handleChange}/>
      </div>
    );
  }
});
