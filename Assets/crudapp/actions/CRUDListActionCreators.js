var ActionTypes = require('../constants/CRUDListConstants').ActionTypes;

export default class CRUDListActionCreators {

  constructor(context) {
    this.dispatcher = context.dispatcher;
  }

  addSelection(recordId, record) {
    this.dispatcher.dispatch({
      "type": ActionTypes.SELECT_RECORD,
      "recordId": recordId,
      "record": record
    });
  }

  removeSelection(recordId) {
    this.dispatcher.dispatch({
      "type": ActionTypes.DESELECT_RECORD,
      "recordId": recordId
    });
  }

  applyFilters(args) {
    this.dispatcher.dispatch({ 
      "type": ActionTypes.FILTER_CHANGE,
      "args": args
    });
  }

  applyFilter(key, value) {
    this.dispatcher.dispatch({ 
      "type": ActionTypes.FILTER_CHANGE,
      "key": key,
      "value": value
    });
  }

  updateSummary(baseUrl, args) {
    var that = this;
    $.getJSON(baseUrl + "/summary.json", args, function(summary) {
      that.dispatcher.dispatch({ 
        "type": ActionTypes.SUMMARY_UPDATE,
        "summary": summary
      });
    });
  }

  changePageSize(pageSize) {
    // go to the first page when page size is changed.
    this.applyFilters({ "page": 1, "pagenum": pageSize });
    this.dispatcher.dispatch({
      "type": ActionTypes.CHANGE_PAGE_SIZE,
      "pageSize": pageSize
    });
  }

  changePage(page) {
    this.applyFilters({ "page": page });
    this.dispatcher.dispatch({
      "type": ActionTypes.CHANGE_PAGE,
      "page": page
    });
  }

}
