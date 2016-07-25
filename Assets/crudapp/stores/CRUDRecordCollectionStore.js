var constants = require('../constants/CRUDStoreActionIds');
var assign = require('object-assign');
var ActionTypes = constants.ActionTypes;


var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

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
   *
   */
  constructor(dispatcher, config) {
    super({
      'primaryKey': config.primaryKey || 'id',
      'page': 1,
      'params': config.query,
      'baseUrl': config.baseUrl || (config.url ? config.url.replace(/\/search$/,'') : null),
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
}
