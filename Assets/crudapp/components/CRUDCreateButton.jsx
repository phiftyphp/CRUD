import React from "react";


import CRUDRelModal from "../CRUDRelModal";

/*
<CRUDCreateButton 
    label="Create"
    size="large"
    side=false
    baseUrl=/bs/user
>
</CRUDCreateButton>



<CRUDCreateButton 
    modelLabel="Create"
    size="large"
    side=false
    baseUrl=/bs/user
>
</CRUDCreateButton>


*/
export default React.createClass({

  propTypes: {
    /**
     * label of the button
     */
    "label": React.PropTypes.string,

    /*
     * the baseUrl of a CRUD handler, usually "/bs"
     */
    "baseUrl": React.PropTypes.string,

    "region": React.PropTypes.any,

    "regionRefresh": React.PropTypes.bool,

    /**
     * The parent record key is used for creating a new record belongs to the parent.
     */
    "parentRecordKey": React.PropTypes.any,

    "rel": React.PropTypes.string,

    "relKey": React.PropTypes.string,

    "btnSize": React.PropTypes.string,

    "btnStyle": React.PropTypes.string,


    // modal related options
    // ==============================
    /**
     * the modal size: it could be "large", "small"
     */
    "size": React.PropTypes.string,


    /**
     * show the modal as a side modal?
     */
    "side": React.PropTypes.bool,

    "reload": React.PropTypes.bool,

    /**
     * the title of the modal
     */
    "title": React.PropTypes.string,

    "onInit": React.PropTypes.func,

    "onSuccess": React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
        regionRefresh: true,
        reload: false,
        btnStyle: "success"
    };
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() { },

  componentWillUnmount: function() { },


  handleClick: function(e) {
    e.stopPropagation();

    const args = {};

    if (this.props.parentRecordKey) {

        args['parent-key'] = this.props.parentRecordKey;

    } else if (this.props.rel) {

        args['rel'] = this.props.rel;
        if (this.props.relKey) {
            args['relKey'] = this.props.relKey;
        }

    }

    CRUDRelModal.open(
        this.props.title || this.props.label || 'Untitled',
        this.props.baseUrl + "/crud/create", args,
        {
            "size": this.props.size || "large",
            "side": this.props.side || false,
            "closeOnSuccess": true,
            "init": this.props.onInit, /* function(e, ui) { */
            "success": (ui, resp) => {
                if (this.props.onSuccess) {
                    this.props.onSuccess(ui, resp);
                }
                if (this.props.regionRefresh && this.props.region) {
                    $(this.props.region).asRegion().refresh();
                }
                if (this.props.reload) {
                    window.location.reload();
                }
             }
        });
  },


  render: function() {
      let btnClassName = "btn";
      if (this.props.btnStyle) {
          btnClassName += " btn-" + this.props.btnStyle;
      }
      if (this.props.btnSize) {
          btnClassName += " btn-" + this.props.btnSize;
      }

      
      return <div key={this.key} className="btn-group">
        <button className={btnClassName} onClick={this.handleClick}>
            {this.props.label || '建立'}
        </button>
      </div>;
  }
});
