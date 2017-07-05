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


<span class="CRUDCreateButton" 
    data-base-url="/bs/recipe-category"
    data-rel="parent" data-rel-key="{{category.key}}"
    data-label="建立子分類"> </span>

*/
export default React.createClass({

  propTypes: {
    /**
     * label of the button
     */
    "label": React.PropTypes.string,

    /**
     * the baseUrl of a CRUD handler, usually "/bs"
     */
    "baseUrl": React.PropTypes.string,


    /**
     * The selector of the target partial for reload.
     */
    "partial": React.PropTypes.any,

    /**
     * The path of the partial to be loaded.
     */
    "partialPath" : React.PropTypes.string,

    /**
     * Refresh the target partiion {props.partial}
     */
    "partialRefresh": React.PropTypes.bool,

    /**
     * Append the partial to the element of the container.
     */
    "partialAppend": React.PropTypes.string,

    "partialPrepend": React.PropTypes.string,


    /**
     * option for reloading the whole page.
     */
    "reload": React.PropTypes.bool,



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




    /**
     * the title of the modal
     */
    "title": React.PropTypes.string,

    "onInit": React.PropTypes.func,

    "onSuccess": React.PropTypes.func,
  },

  getDefaultProps: function() {
    return {
        "partialRefresh": true,
        "reload": false,
        "btnStyle": "success"
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
                if (this.props.reload) {
                    window.location.reload();
                } else if (this.props.partialPath && this.props.partial && (this.props.partialAppend || this.props.partialPrepend)) {

                    let partialPath = this.props.partialPath;
                    for (let key in resp.data) {
                        partialPath = partialPath.replace(`%${key}%`, resp.data[key]);
                    }

                    if (this.props.partialAppend) {
                        Region.append($(this.props.partial), partialPath);
                    } else if (this.props.partialPrepend) {
                        Region.prepend($(this.props.partial), partialPath);
                    }

                    // $(this.props.partial).asRegion().refresh();

                } else if (this.props.partialRefresh && this.props.partial) {
                    $(this.props.partial).asRegion().refresh();
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
