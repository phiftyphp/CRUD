var ActionTypes = require('../constants/CRUDStoreActionIds').ActionTypes;

export default class CRUDStoreActionCreators {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  loadRecords(records) {
    this.dispatcher.dispatch({ "type": ActionTypes.LOAD_RECORDS });
  }
  addRecord(index, record) {
    this.dispatcher.dispatch({
      "type": ActionTypes.ADD_RECORD,
      "index": index,
      "record": record
    });
  }
  removeRecord(index) {
    this.dispatcher.dispatch({
      "type": ActionTypes.REMOVE_RECORD,
      "index": index
    });
  }
}
