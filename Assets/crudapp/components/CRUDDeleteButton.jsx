import React from "react";

import CRUDRelModal from "../CRUDRelModal";

/*
<CRUDDeleteButton 
    label="Create"
    size="large"
    side=false
    baseUrl=/bs/user
>
</CRUDDeleteButton>
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

    /**
     * The parent record key is used for creating a new record belongs to the parent.
     */
    "recordKey": React.PropTypes.any,

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

    /**
     * the title of the modal
     */
    "title": React.PropTypes.string,

    "onInit": React.PropTypes.func,

    "onSuccess": React.PropTypes.func,

    "redirect": React.PropTypes.any,
  },

  getDefaultProps: function() {
    return {
        btnStyle: "default"
    };
  },

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() { },

  componentWillUnmount: function() { },


  handleClick: function(e) {
    e.stopPropagation();

    console.log(this.props.redirect);



    CRUDRelModal.open(
        this.props.title || this.props.label || 'Untitled',
        this.props.baseUrl + "/crud/delete", { key: this.props.recordKey },
        {
            "size": this.props.size || "large",
            "side": this.props.side || false,
            "closeOnSuccess": true,
            "controls": [
                {
                    "label": "刪除",
                    "primary": true,
                    "onClick": (e, ui) => { return ui.body.find("form").submit(); }
                }
            ],
            "init": this.props.onInit, /* function(e, ui) { */
            "success": (ui, resp) => {
                if (this.props.onSuccess) {
                    this.props.onSuccess(ui, resp);
                }
                if (typeof this.props.redirect === "string") {
                    setTimeout(() => {
                        window.location = this.props.redirect;
                    }, 500);
                } else if (this.props.region) {
                    $(this.props.region).asRegion().refresh();
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
            {this.props.label || '刪除'}
        </button>
      </div>;
  }
});
