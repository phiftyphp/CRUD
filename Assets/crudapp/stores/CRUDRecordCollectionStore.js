var constants = require('../constants/CRUDRecordCollectionConstants');
var assign = require('object-assign');
var ActionTypes = constants.ActionTypes;

import CRUDStore from "./CRUDStore";

/**
 * CRUDRecordCollectionStore loads records from CRUDHandler
 *
 * this class provides addRecord, removeRecord
 */
export default class CRUDRecordCollectionStore extends CRUDStore {

  /**
   * @param {flux.Dispatcher} dispatcher
   * @param {object} config { primaryKey:'id', url: '...', query: { ...search params... } }
   */
  constructor(dispatcher, config) {
    var url = config.url;

    // replace the tailing "/search" to make it backward compatible.
    var baseUrl = url.replace(/\/search$/,''); 

    super({
      'primaryKey': config.primaryKey || 'id',
      'page': 1,
      'params': config.query,
      'baseUrl': config.baseUrl || baseUrl,
    });

    this.dispatchToken = dispatcher.register((action) => {
      switch(action.type) {
        case ActionTypes.ADD_RECORD:
          this.addRecord(action.index, action.record);
          break;
        case ActionTypes.REMOVE_RECORD:
          this.removeRecord(action.index)
          break;
        case ActionTypes.LOAD_RECORDS:
          this.loadRecords();
          break;
      }
    });
  }

  /**
   * Load records into the store
   *
   * @deprecated
   */
  loadRecords() {
    var primaryKey = this.getPrimaryKey();
    this.records = {};
    super.search(this.config.url, this.config.query || {}).done((records, done) => {
      let i = 0 , len = records.length;
      for (; i < len; i++) {
        let record = records[i];
        var key = record[primaryKey];
        this.records[key] = record;
      }
      done();
    });
  }
}
