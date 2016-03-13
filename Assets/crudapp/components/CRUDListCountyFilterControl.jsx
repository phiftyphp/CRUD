
var React = require('react');

export default React.createClass({
  getInitialState: function() {
    return { "cities": [ ] };
  },

  componentDidMount: function() {
    var that = this;
    $.get('/=/city', {}, function(cities) {
      if (that.isMounted()) {
        that.setState({ "cities": cities });
      }
    }, "json");
  },

  handleChange: function(e) {
    this.props.context.actionCreators.applyFilter("city_id", e.target.value);
  },

  render: function() {
    var options = [];
    options.push(<option value={0}>請選擇縣市</option>);
    var that = this;
    this.state.cities.map(function(city) {
      options.push(<option key={"city-" + city["id"]} value={city["id"]}>{city["name"]}</option>);
    });
    return (
      <select className="form-control" onChange={this.handleChange}>
        {options}
      </select>
    );
  }
});
