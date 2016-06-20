"use strict";

import CRUDListKeywordFilterControl from './CRUDListKeywordFilterControl';
import CRUDListSelectionSection from './CRUDListSelectionSection';
import CRUDListRegion from './CRUDListRegion';
import CRUDListActionCreators from '../actions/CRUDListActionCreators';
import CRUDListPageSizeControl from './CRUDListPageSizeControl';
import CRUDListPaginationControl from './CRUDListPaginationControl';

// used store
import CRUDListSummaryStore from '../stores/CRUDListSummaryStore';
import CRUDListFilterStore from '../stores/CRUDListFilterStore';
import CRUDListSelectionStore from '../stores/CRUDListSelectionStore';

import BulkManager from './BulkManager';

import {Dispatcher} from "flux";
import React from "react";

export default {

  propTypes: {
    /*
     * the crud Id, which could be: "org", "users", "stores" ... etc
     */
    "crudId": React.PropTypes.string.isRequired,

    /*
     * the basepath of a CRUD handler, usually "/bs"
     */
    "basepath": React.PropTypes.string.isRequired,
    "namespace": React.PropTypes.string.isRequired,
    "model": React.PropTypes.string.isRequired,
    "modelLabel": React.PropTypes.string.isRequired,
    "controls": React.PropTypes.array,
    // csrf token is needed for sending actions
    "csrfToken": React.PropTypes.string,

    "disableSelection": React.PropTypes.bool
  },

  getDefaultProps: function() {
    return { "filters": { } };
  },

  getInitialState: function() {
    var dispatcher = new Dispatcher;
    var context = {
      "dispatcher": dispatcher
    };
    context.filterStore = new CRUDListFilterStore(context, this.props.filters);
    context.selectionStore = new CRUDListSelectionStore(context);
    context.summaryStore = new CRUDListSummaryStore(context);
    context.actionCreators = new CRUDListActionCreators(context);
    return {
      "context": context,
      "filters": this.props.filters
    };
  },

  componentDidMount: function() {
    // the summary should be updated when filter is changed.
    this.state.context.filterStore.addChangeListener(this.handleFilterChange);
    this.state.context.summaryStore.addChangeListener(this.handleSummaryChange);
    this.state.context.actionCreators.updateSummary(this.props.basepath, this.state.context.filterStore.getArgs());
  },

  componentWillUnmount: function() {
    this.state.context.filterStore.removeChangeListener(this.handleFilterChange);
    this.state.context.summaryStore.removeChangeListener(this.handleSummaryChange);
  },

  handleCreateAction: function(e) {
    e.stopPropagation();

    var that = this;
    CRUDModal.open({
      "title": "建立新的" + this.props.modelLabel,
      "size": "large",
      "side": true,
      "url": this.props.basepath + "/crud/create",
      "closeOnSuccess": true,
      "init": function(e, ui) {
        // the modal content init callback
      },
      "success": function(ui, resp) {
        // this will be triggered when the form is submitted successfully
        that.refs.region.updateRegion();
      }
    });
  },

  handleEditAction: function(e) {
    e.stopPropagation();
    var that = this;
    var $btn = $(e.currentTarget);
    CRUDModal.open({
      "title": $btn.data("modalTitle") || "編輯" + this.props.modelLabel,
      "size": "large",
      "side": true,
      "closeOnSuccess": true,
      "url": this.props.basepath + "/crud/edit",
      "id": parseInt($btn.data("recordId")),
      "init": function(e, ui) {
        // the modal content init callback
      },
      "success": function(ui, resp) {
        // this will be triggered when the form is submitted successfully
        that.refs.region.updateRegion();
      }
    });
  },

  handleExcelExportAction: function(e) {
    // get the arguments from current state
    var params = this.refs.region.getCurrentQueryParams();
    var url = this.props.basepath + "/export/excel?" + jQuery.param(params);
    window.location = url;
  },

  handleCsvExportAction: function(e) {
    // get the arguments from current state
    var params = this.refs.region.getCurrentQueryParams();
    var url = this.props.basepath + "/export/csv?" + jQuery.param(params);
    window.location = url;
  },

  handleImportAction: function(e) {
    e.stopPropagation();
    var that = this;

    var proceedToExcelImport = function(ui, resp) {
      CRUDModal.update(ui, {
        "title": "匯入中...",
        "content": "匯入中...",
        "controls": []
      });
      var params = {};

      // TODO: Rename ImportOrgSimple to customized action name
      runAction("OrgBundle::Action::ImportOrgSimple", params , function(resp) {
        if (resp.success) {
          CRUDModal.update(ui, {
            "title": "匯入完畢",
            "content": resp.message,
            "controls": [{ "label": "關閉", "close": true }]
          });
        } else {
          CRUDModal.update(ui, {
            "title": "匯入發生錯誤",
            "content": resp.message,
            "controls": [{ "label": "關閉", "close": true }]
          });
        }
      });
    };

    var proceedToColumnSelection = function(ui, resp) {
      CRUDModal.update(ui, {
        "title": "選擇對應欄位",
        "ajax": {
          "url": that.props.basepath + "/import/column-map"
        },
        "controls": [],
        "init": function(e, ui) {
        },
        "success": function(ui, resp) {
        }
      });
    };

    CRUDModal.open({
      "title": "匯入資料",
      "size": "large",
      "side": true,
      "url": that.props.basepath + "/import/upload",
      "init": function(e, ui) {
        // the modal content init callback
      },
      "success": function(ui, resp) {
        if (resp.data.advanced) {
          proceedToColumnSelection(ui, resp);
        } else {
          proceedToExcelImport(ui, resp);
        }
      },
      "controls": [
        { "label": "上傳", "primary": true, "onClick": function(e,ui) { ui.body.find("form").submit() } }
      ]
    });
  },

  /**
   * @param {Event}
   */
  handleSummaryChange: function(e) {
    var summary = this.state.context.summaryStore.getSummary();
    if (this.refs.selectionSection) {
      this.refs.selectionSection.setState({ "numberOfTotalItems": summary.numberOfTotalItems });
    }

    if (this.refs.pagination) {
      var numberOfPages = summary.numberOfTotalItems ? Math.ceil(summary.numberOfTotalItems / this.state.context.filterStore.getPageSize()) : 1;
      this.refs.pagination.setState({ 
        "numberOfPages": numberOfPages
      });
    }
  },

  /**
   * @param {Event}
   */
  handleFilterChange: function(e) {
    this.state.context.actionCreators.updateSummary(this.props.basepath, this.state.context.filterStore.getArgs());
    if (this.refs.pagination) {
      this.refs.pagination.setState({
        "pageSize": this.state.context.filterStore.getPageSize(),
        "currentPage": this.state.context.filterStore.getPage()
      });
    }
  },

  /**
   * @param {Event}
   */
  handleSelect: function(e) {
    e.stopPropagation()
    var $input = $(e.currentTarget);
    var $tr = $input.parents("tr");
    var val = parseInt($input.val());
    // "active" class is used for bootstrap
    if ($input.is(':checked')) {
      $tr.addClass('selected active');
      this.state.context.actionCreators.addSelection(val);
    } else {
      $tr.removeClass('selected active');
      this.state.context.actionCreators.removeSelection(val);
    }
  },


  /**
   * handleRowSelect add the checkbox into selectionStore
   *
   * @param {Event}
   */
  handleRowSelect: function(e) {
    e.stopPropagation();
    var $check, $tr, val;
    if ($(e.target).is("span.check") || $(e.target).is(".crud-bulk-select")) {
      return;
    }
    $tr = $(e.currentTarget);
    $check = $tr.find('.crud-bulk-select');
    val = parseInt($check.val());
    if ($check.is(':checked')) {
      $check.prop('checked', false);
      $tr.removeClass('selected active');
      this.state.context.actionCreators.removeSelection(val);
    } else {
      $check.prop('checked', true);
      $tr.addClass('selected active');
      this.state.context.actionCreators.addSelection(val);
    }
  },

  /**
   * @param {Event}
   */
  handleSelectAll: function(e) {
    var that = this;
    e.stopPropagation();
    this.bulkManager.toggleSelectAll(e);

    // update selections in the store
    var checkboxes = this.bulkManager.findCheckboxes()
    checkboxes.each(function() {
      var $input = $(this);
      var val = parseInt($input.val());
      if ($input.is(":checked")) {
        that.state.context.actionCreators.addSelection(val);
      } else {
        that.state.context.actionCreators.removeSelection(val);
      }
    });
  },

  /**
   * @param {Exception}
   */
  handleRecordDelete: function(e) {
    e.stopPropagation();
    var $btn = $(e.currentTarget);
    if (!$btn.data("delete-action")) {
      console.error("data-delete-action undefined");
      return;
    }
    var id = $btn.data("record-id");
    runAction($btn.data("delete-action"), { "id": id }, { "confirm": "確認刪除? ", "removeTr": $btn });
  },


  /**
   * @param {jQuery} $region
   */
  initListManager: function($region) {
    var that = this;
    this.table = $region.find('.crud-list table');
    this.bulkManager = new BulkManager(this.table);
    this.bulkManager.init();

    // Apply selection from CRUDListSelectionStore
    var selections = this.state.context.selectionStore.getSelection();
    $(selections).each(function() {
      var $input = that.bulkManager.findCheckboxByValue(this);
      if ($input[0]) {
        $input.prop('checked', true);
      }
    });



    // Handle select All event
    this.table.on("click", ".crud-bulk-select-all", this.handleSelectAll);

    // Handle checkbox change event
    this.table.on("change", "input.crud-bulk-select", this.handleSelect);

    // initialized row click event
    this.table.on("click", "tbody tr", this.handleRowSelect);

    // handle edit button click event
    // TODO:
    // the handler depends on bulk config array and CRUDModal object make it
    // generic to be passed from app props
    this.table.on("click", ".record-edit-btn", this.handleEditAction);
    this.table.on("click", ".record-delete-btn", this.handleRecordDelete);
  },

  /**
   * @param {HTMLElement} controlConfig
   */
  onRegionLoaded: function(regionDom) {
    var $region = $(regionDom);
    if (this._initTimer) {
      clearTimeout(this._initTimer);
      this._initTimer = null;
    }
    this._initTimer = setTimeout(function() {
      jQuery.material.checkbox($region.find('.checkbox > label > input[type=checkbox]'))
    }, 300);
    this.initListManager($region);
  },

  // renderFilterSection: function() { },


  /**
   * @param {object} controlConfig
   */
  renderCreateControl: function(controlConfig) {
    return <div key={"create"} className="btn-group">
        <button className="btn btn-success"
        onClick={this.handleCreateAction}>
          {controlConfig.label||'建立'}
        </button>
      </div>;
  },

  /**
   * @param {object} controlConfig
   */
  renderImportControl: function(controlConfig) {
    return 
      <div key="import" className="btn-group">
        <button className="btn btn-material-grey-700" onClick={this.handleImportAction}>
          {controlConfig.label||'匯入'}
        </button>
      </div>;
  },

  /**
   * @param {object} controlConfig
   */
  renderExportControl: function(controlConfig) {
    return
      <div key="export" className="btn-group">
        <div className="dropdown">
          <button className="btn btn-default btn-material-grey-700 dropdown-toggle" type="button" data-toggle="dropdown">
            {controlConfig.label||'匯出'}
            &nbsp;
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li><a href="#" onClick={this.handleCsvExportAction}>Export CSV</a></li>
            <li><a href="#" onClick={this.handleExcelExportAction}>Export Excel</a></li>
          </ul>
        </div>
      </div>
    ;
  },

  /**
   * @param {Array<object>} target
   */
  renderControls: function(controls) {
    var childViews = [];

    controls.forEach((controlConfig, i) => {
      var a = controlConfig.action || controlConfig.feature;
      switch (a) {
        case "create":
          childViews.push(this.renderCreateControl(controlConfig));
          break;
        case "export":
          childViews.push(this.renderExportControl(controlConfig));
          break;
        case "import":
          childViews.push(this.renderImportControl(controlConfig));
          break;
      }
    });
    return <div className="control-section">
        <div className="btn-toolbar">
          {childViews}
        </div>
      </div>
      ;
  },

  render: function() {
    var that = this;
    var controlSection = this.renderControls(this.props.controls);
    return (
      <div className="crud-list-container">
        {controlSection}
        {this.renderFilterSection ?  this.renderFilterSection() : null}

        <div className="clearfix custom-row row">

          {this.props.disableSelection ? null :
          <div className="col-md-4 pull-left">
            <CRUDListSelectionSection 
              ref="selectionSection" 
              selectionStore={this.state.context.selectionStore}
              app={this}
              context={this.state.context}
              />
          </div>
          }

          <div className="upon-table-pager col-md-8 pull-right">
            <div className="form-inline">
              <CRUDListPageSizeControl 
                ref="pageSize" 
                context={this.state.context}
                pageSize={this.state.context.filterStore.getPageSize()}
              />
              <CRUDListPaginationControl 
                ref="pagination" 
                context={this.state.context}
                pageSize={this.state.context.filterStore.getPageSize()}
              />
            </div>
          </div>
        </div>
        <CRUDListRegion ref="region" 
          path={this.props.basepath + "/crud/list_inner"} 
          context={this.state.context}
          filterStore={this.state.context.filterStore} 
          args={this.state.filters} 
          onLoad={this.onRegionLoaded}/>
      </div>
    );
  }
};
