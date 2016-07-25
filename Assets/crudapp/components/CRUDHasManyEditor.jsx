import React from "react";
import CRUDRecordCollectionStore  from "../stores/CRUDRecordCollectionStore";
import CRUDStoreActionCreators from "../actions/CRUDStoreActionCreators";
import ImageCoverViewBuilder from "../viewbuilder/ImageCoverViewBuilder";
import TextCoverViewBuilder from "../viewbuilder/TextCoverViewBuilder";
import CRUDRelModal from "../CRUDRelModal";
import {Dispatcher} from "flux";

export default React.createClass({
  propTypes: {
    /**
     * The crud Id, which could be: "org", "users", "stores" ... etc
     */
    "crudId": React.PropTypes.string.isRequired,
    /**
     * The baseUrl of a CRUD handler, usually "/bs"
     */
    "baseUrl": React.PropTypes.string.isRequired,

    /**
     * The schema of the child records.
     */
    "schema": React.PropTypes.object.isRequired,



    /**
     * Predefined parameters are used for creating new records
     */
    "predefined": React.PropTypes.object,

    /**
     * The parent record of the children records
     *
     *    "references": {
     *      "shop_id": {
     *        "record": {{CRUD.Record.toArray()|json_encode|raw}},
     *        "key": "id",
     *        "referedRelationship": "images"
     *      }
     *    },
     */
    "references": React.PropTypes.object.isRequired,


    /**
     * The description object of generating item view.
     *
     * Here is one example itemDesc config:
     *
     *    "itemDesc": {
     *      "view": "TextView", // specify view type explicitly
     *      "display": "float",
     *      "coverImage": {
     *        "field": ["thumb", "image"],
     *        "width": 200,
     *        "height": 100,
     *        "backgroundSize": "cover"
     *      }
     *    },
     *
     */
    "itemDesc": React.PropTypes.object,


    /**
     * viewBuilder object to build the item views
     */
    "viewBuilder": React.PropTypes.oneOfType([
      React.PropTypes.func, // view builder function name
      React.PropTypes.object // view builder instance
    ]),

    /**
     * The parent action of this CRUDRelationApp editor
     *
     * Valid values are "create", "edit" or "update"
     *
     * @code
     *
     *     "parentAction": {% if CRUD.Record.id %}"edit"{% else %}"create"{% endif %},
     *
     * @code
     */
    "parentAction": React.PropTypes.string.isRequired,

    /**
     * the load query
     *
     * @code
     *
     * load: { query: { ... } }
     *
     * @endcode
     */
    "load": React.PropTypes.object,

    /**
     * config for delete action
     *
     *    "delete": {
     *      "action": "App::Action::DeleteDShopImage",
     *      "by": "id",
     *      "confirm": "確認刪除?"
     *    }
     */
    "delete": React.PropTypes.object,


    /**
     * Event handlers
     */
    "onAddItem": React.PropTypes.func,
    "onEditItem": React.PropTypes.func,
    "onDeleteItem": React.PropTypes.func,
  },

  /******** @pragma BEGIN OF REACT COMPONENT METHODS *******/
  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {

    // create a dispatcher object in each editor scope.
    var dispatcher = new Dispatcher;
    var state = {};
    state.dispatcher = dispatcher;

    // predefined the load behavior
    // TODO: should we move the loader config to loadRecords action method?
    state.recordCollectionStore = new CRUDRecordCollectionStore(dispatcher, {
      "baseUrl": this.props.baseUrl,
      "params": this.buildReferenceParams(this.props.load ? this.props.load.query : {} || {})
    });

    state.recordCollectionActionCreators = new CRUDStoreActionCreators(dispatcher);
    state._records = [];
    return state;
  },

  componentDidMount: function() {
    this.state.recordCollectionStore.addChangeListener(this.handleStoreChange);
    // "update" or "edit" should trigger record loading.
    if (this.props.parentAction != "create") {
      this.state.recordCollectionActionCreators.loadRecords();
    }
  },

  componentWillUnmount: function() {
    this.state.recordCollectionStore.removeChangeListener(this.handleStoreChange);
  },



  /**
   * This handler method is used for 
   */
  handleClickItem: function(item, e) {
    e.preventDefault();
  },

  /******** @pragma PRIVATE METHODS *******/

  /*
   * Build query params from reference info.
   *
   * @param {object} predefinedParameters
   */
  buildReferenceParams: function(predefinedParameters) {
    var params = Object.assign({}, predefinedParameters);
    if (this.props.references) {
      for (var foreignKey in this.props.references) {
        var referenceInfo = this.props.references[foreignKey];
        params[foreignKey] = referenceInfo.record[referenceInfo.key];
      }
    }
    return params;
  },

  /********** BINDING METHODS ***********/
  handleStoreChange: function() {
    var records = this.state.recordCollectionStore.objects();
    this.setState({ '_records': records });
  },


  /**
   * When user clicks on Add Item button.
   *
   * This handler uses title, baseUrl properties to create a modal
   */
  handleAddItem: function(e) {
    e.preventDefault();

    if (this.props.onAddItem) {
      return this.props.onAddItem.call(this, e);
    }

    // The default behavior
    var that = this;
    var params = this.buildReferenceParams(this.props.predefined);
    var defer = CRUDRelModal.open("新增" + this.props.title, this.props.baseUrl + "/crud/edit", params);
    defer.done(function(resp) {
      if (resp.success && typeof resp.data !== "undefined") {
        that.state.recordCollectionStore.addRecord(resp.data);
      } else {
        console.error("failed to add record", resp);
      }
    });
    defer.fail(function(resp) {  });
  },


  handleEditItem: function(item, e) {
    e.preventDefault();

    if (this.props.onEditItem) {
      return this.props.onEditItem.call(this, item, e);
    }

    var that = this;
    var params = this.buildReferenceParams();

    if (this.props.schema.primaryKey) {
      params[ this.props.schema.primaryKey ] = item[ this.props.schema.primaryKey ];
    } else {
      params.id = item.id;
    }

    var defer = CRUDRelModal.open("編輯" + this.props.title, this.props.baseUrl + "/crud/edit", params);
    defer.done(function(resp) {
      if (resp.success && typeof resp.data !== "undefined") {
        // Sometimes resp.data doesnt contains all fields
        //   that.state.recordCollectionStore.addRecord(resp.data);
        that.state.recordCollectionStore.loadRecords(resp.data);
      } else {
        console.error("failed to add record", resp);
      }
    });
    defer.fail(function(resp) {  });
  },

  handleDeleteItem: function(item, e) {
    e.preventDefault();

    if (this.props.onDeleteItem) {
      return this.props.onDeleteItem.call(this, item, e);
    }

    // if we have existing record id
    if (item.id) {
      if (this.props.delete && this.props.delete.action) {
        let byField = this.props.delete.by || this.props.schema.primaryKey || 'id'; // default by id 
        let config = {};
        let params = {};

        if (typeof byField === "string") {
          params[ byField ] = item[ byField ];
        } else if (typeof byField === "array") {
          byField.forEach(function(val,i) {
            params[val] = item[val];
          });
        }
        if (typeof this.props.delete.confirm === "boolean" && this.props.delete.confirm) {
          config.confirm = '確認刪除';
        } else if (typeof this.props.delete.confirm === "string") {
          config.confirm = this.props.delete.confirm;
        }

        config.onSuccess = (resp) => {
          // TODO: remove the item when success
          this.state.recordCollectionStore.removeRecord(item);
        };
        config.onError = (resp) => { };

        runAction(this.props.delete.action, params, config);
      } else {
        console.warn("delete config is not defined.");
      }
    } else {
      // it's a mock record for action to create
    }
  },

  /**
   * Create view builder from itemDesc
   *
   * @param {Object} itemDesc
   */
  createViewBuilder: function(itemDesc) {
    if (itemDesc.view) {
      switch (itemDesc.view) {
        case "TextCoverView":
          return new TextCoverViewBuilder(itemDesc);
        break;
        case "ImageCoverView":
          return new ImageCoverViewBuilder(itemDesc);
        break;
      }
    }
    if (itemDesc.coverImage) {
      return new ImageCoverViewBuilder(itemDesc);
    } else if (itemDesc.title) {
      return new TextCoverViewBuilder(itemDesc);
    }
    return false;
  },


  /**
   * When viewBuilder option is provided, we will use it instead of itemDesc.
   *
   * @return {React.Component}
   */
  render: function() {
    var itemDesc = this.props.itemDesc;
    var viewBuilder = this.props.viewBuilder || this.props.viewbuilder;
    // Convert function into object
    if (typeof viewBuilder === "function") {
      viewBuilder = new viewBuilder(this.props.itemDesc);
    }
    if (!viewBuilder) {
      // Detect view builder type automatically
      viewBuilder = this.createViewBuilder(itemDesc);
      if (!viewBuilder) {
        console.error("Can't create view builder for rendering records. Using default TextCoverView.");
        viewBuilder = new ImageCoverViewBuilder(itemDesc);
      }
    }
    return viewBuilder.render(this, this.state._records);
  }
});
