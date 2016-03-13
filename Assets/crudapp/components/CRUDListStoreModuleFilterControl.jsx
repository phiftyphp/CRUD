var React = require('react');

export default React.createClass({

  getInitialState: function() {
    return {
      "modules": []
    };
  },

  componentDidMount: function() {
    var that = this;
    $.getJSON("/=/module", {}, function(modules) {
      if (that.isMounted()) {
        that.setState({ "modules": modules });
      }
    });
  },

  handleChange: function(e) {
    this.props.context.actionCreators.applyFilter("module", e.target.value);
  },

  render: function() {
    var options = [];
    options.push(<option key={0} value={0}>所有模組</option>);

    var that = this;
    this.state.modules.map(function(module) {
      options.push(<option key={"module-" + module["value"]} value={module["value"]}>{module["label"]}</option>);
    });
    return (
      <select className="form-control" onChange={this.handleChange}>
        {options}
      </select>
    );
  }

});
