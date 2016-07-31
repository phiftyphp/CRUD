import CRUDBaseStore from "./CRUDBaseStore";
import CRUDStoreActionIds from "../constants/CRUDStoreActionIds";
var ActionTypes = CRUDStoreActionIds.ActionTypes;
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

/**
 * CRUDStore defines the basic functions for CRUD
 */
export default class CRUDStore extends CRUDBaseStore
{
  /**
   * @param {flux.Dispatcher} dispatcher
   * @param {object} config { primaryKey:'id', url: '...', query: { ...search params... } }
   */
  constructor(dispatcher, config) {
    super({
      'primaryKey': config.primaryKey || 'id',
      'page': 1,
      'params': config.query,
      'baseUrl': config.baseUrl || (config.url ? config.url.replace(/\/search$/,'') : null),
    });

    // the records is a list instead of Map
    this.records = [];

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
        case ActionTypes.APPEND_RECORDS:
          // TODO: fix me
          this.loadRecords();
          break;
      }
    });
  }

  /**
   * @param {string}
   */
  load(id) {

  }

  /**
   * Return all objects
   */
  objects() {
    return this.records;
  }

  keys() {
    return this.records.keys();
  }

  /**
   * Check if a record exists.
   */
  hasRecord(key) {
    return this.records[key] ? true : false;
  }

  /**
   * Load records into the store
   *
   * @deprecated
   */
  loadRecords() {
    var primaryKey = this.getPrimaryKey();
    this.records = {};

    let url = this.getSearchUrl();
    this.search(url, this.buildParams()).done((records, done) => {
      let i = 0, len = records.length;
      for (; i < len; i++) {
        let record = records[i];
        let key = record[primaryKey];
        this.records[key] = record;
      }
      done();
    });
  }

  /**
   * add one record to the store by it's primary key 
   *
   * @param {Object<Record>}
   */
  addRecord(record) {
    const primaryKey = this.getPrimaryKey();
    var key = record[primaryKey];
    this.records.push(record);
    this.emitChangeEvent();
  }


  /**
   * remove one record by the record object.
   *
   * @param {Object<Record>}
   */
  removeRecord(_record) {
    const primaryKey = this.getPrimaryKey();
    var key = _record[primaryKey];
    this.records = _.filter(this.records, (record) => {
      return record[primaryKey] != _record[primaryKey];
    });
    this.emitChangeEvent();
  }

  /**
   * Remove all records
   */
  removeAll() {
    this.records = [];
    this.emitChangeEvent();
  }
}
