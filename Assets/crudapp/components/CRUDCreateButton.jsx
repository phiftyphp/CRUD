import React from "react";
export default React.createClass({

  propTypes: {
    /**
     * the label of the button
     */
    "label": React.PropTypes.string,

    /**
     * The crud Id, which could be: "org", "users", "stores" ... etc
     */
    "crudId": React.PropTypes.string.isRequired,

    /*
     * the baseUrl of a CRUD handler, usually "/bs"
     */
    "baseUrl": React.PropTypes.string,
    "basepath": React.PropTypes.string, // previous property

    "namespace": React.PropTypes.string.isRequired,

    "model": React.PropTypes.string.isRequired,
    "modelLabel": React.PropTypes.string.isRequired,

    "onInit": React.PropTypes.func,
    "onSuccess": React.PropTypes.func,

    // csrf token is needed for sending actions
    "csrfToken": React.PropTypes.string,

    // modal related options
    // ==============================
    
    // the modal size: it could be "large", "small"
    "size": React.PropTypes.string,

    // show the modal as a side modal?
    "side": React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() { },

  componentWillUnmount: function() { },

  handleCreateAction: function(e) {
    e.stopPropagation();

    const that = this;
    CRUDModal.open({
        "title": "建立新的" + this.props.modelLabel,
        "size": this.props.size || "large",
        "side": this.props.side || true,
        "closeOnSuccess": true,
        "url": (this.props.basepath || this.props.baseUrl) + "/crud/create",
        "init": this.props.onInit, /* function(e, ui) { */
        "success": this.props.onSuccess, /* function(ui, resp) { */
    });
  },
  render: function() {
      return <div key={this.props.key} className="btn-group">
        <button className="btn btn-success" onClick={this.handleCreateAction}>
            {this.props.label || '建立'}
        </button>
      </div>;
  }
});
