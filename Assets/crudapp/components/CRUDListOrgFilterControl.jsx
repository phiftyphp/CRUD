

var React = require('react');

export default React.createClass({

  propTypes: {
    "context": React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return { "orgs": [] };
  },

  componentDidMount: function() {
    var that = this;
    $.getJSON("/=/org", function(orgs) {
      if (that.isMounted()) {
        that.setState({ "orgs": orgs });
      }
    });
  },

  handleChange: function(e) {
    this.props.context.actionCreators.applyFilter("org_id", e.target.value);
  },

  render: function() {
    var options = [];
    var that = this;

    options.push(<option key={0} value={0}>請選擇組織</option>);

    if (this.state.orgs) {
      this.state.orgs.map(function(item) {
        options.push(<option key={"org-" + item["id"]} value={item["id"]}>{item["name"] + " (" + item["code"] + ")"}</option>);
      });
    }
    return (
      <select className="form-control" onChange={this.handleChange}>
        {options}
      </select>
    );
  }
});
