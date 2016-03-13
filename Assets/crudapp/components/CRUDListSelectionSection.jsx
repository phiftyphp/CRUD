var React = require('react');
export default React.createClass({

  propTypes: function() {
    return {
      // CRUD app
      "app": React.Types.object.isRequired,
      "context": React.Types.object.isRequired
    };
  },

  getInitialState: function() {
    return {
      "numberOfTotalItems": 0,
      "numberOfSelectedItems": 0
    };
  },

  componentDidMount: function() {
    this.props.context.selectionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    this.props.context.selectionStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(function(previousState, props) {
      var selectedKeys = this.props.context.selectionStore.getSelection();
      previousState.numberOfSelectedItems = selectedKeys.length;
    });
  },

  render: function() {
    return (
      <div className="toggle-filter-container col-md-6 pull-left">
        <a href="#" className="text-primary filter-item active">
          全部{this.props.app.props.modelLabel} ({this.state.numberOfTotalItems})
        </a>
        <a href="#" className="text-primary filter-item">
          已選擇 (<span className="number-of-selected-items">{this.state.numberOfSelectedItems}</span>)
        </a>
      </div>
    );
  }
});
