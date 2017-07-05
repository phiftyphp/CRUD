import React from "react";
import CRUDRelModal from "../CRUDRelModal";

import CRUDCreateButton from "./CRUDCreateButton";
import CRUDEditButton from "./CRUDEditButton";
import CRUDDeleteButton from "./CRUDDeleteButton";

/*
<CRUDEditButton 
    label="Edit"
    size="large"
    side=false
    recordKey={3}
    baseUrl=/bs/user
>
</CRUDEditButton>

*/
export default React.createClass({

  propTypes: {
    /**
     * The primary key of the record. the reason we didn't use "key" is because react already uses "key" as the component key.
     */
    "recordKey": React.PropTypes.any.isRequired,

    /*
     * the baseUrl of a CRUD handler, usually "/bs"
     */
    "baseUrl": React.PropTypes.string,

    /**
     * the partial DOM element used for updating.
     */
    "partial": React.PropTypes.any,

    // modal related options
    // ==============================
    /**
     * the modal size: it could be "large", "small"
     */
    "size": React.PropTypes.string,

    "btnSize": React.PropTypes.string,

    "btnStyle": React.PropTypes.string,

    "onInit": React.PropTypes.func,

    "onSuccess": React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
        "partialRefresh": true,
        "btnStyle": "default"
    };
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() { },

  componentWillUnmount: function() { },

  render: function() {

    return <div this={this.key} className="btn-group">
        <CRUDEditButton 
            baseUrl={this.props.baseUrl}
            partial={this.props.partial}
            btnStyle={this.props.btnStyle} 
            btnSize={this.props.btnSize}
            size={this.props.size}
            recordKey={this.props.recordKey} 
            onInit={this.props.onInit}
            onSuccess={this.props.onSuccess}
            label="編輯"
        />
        <CRUDDeleteButton 
            baseUrl={this.props.baseUrl}
            partial={this.props.partial}
            btnStyle={this.props.btnStyle} 
            btnSize={this.props.btnSize}
            size={this.props.size}
            recordKey={this.props.recordKey} 
            onInit={this.props.onInit}
            onSuccess={this.props.onSuccess}
            label="刪除"
        />
    </div>;
  }
});
