"use strict";

import CRUDListFilterStore from "../stores/CRUDListFilterStore";

var React = require('react');
export default React.createClass({

  propTypes: {
    "path": React.PropTypes.string.isRequired,
    "context": React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      "args": this.props.args || {},
      "path": this.props.path
    };
  },

  componentDidMount: function() {
    this.props.context.filterStore.addChangeListener(this._onFilterChange);
    this.updateRegion();
  },

  componentWillUnmount: function() {
    this.props.context.filterStore.removeChangeListener(this._onFilterChange);
  },

  getCurrentQueryParams: function() {
    return this.state.args || {};
  },

  updateRegion: function(callback) {
    var that = this;
    $.get(this.state.path, this.state.args, function(htmlResponse) {
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

  setRegionContent: function(content) {
    if (this.refs.content) {
      var el = ReactDOM.findDOMNode(this.refs.content);
      if (el) {
        el.innerHTML = content;
      }
    }
  },

  _onFilterChange: function() {
    var that = this;
    var newArgs = this.props.context.filterStore.getArgs();
    this.setState(function(previousState, currentProps) {
      var args = previousState.args;
      for (var key in newArgs) {
        args[key] = newArgs[key];
      }
      return { "args": args };
    }, function() {
      that.updateRegion();
    });
  },

  render: function() {
    return (
      <div ref="content">
      </div>
    );
  }
});
