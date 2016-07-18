var constants = require('../constants/CRUDRecordCollectionConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = constants.ActionTypes;

var CHANGE_EVENT = 'change';

export default class CRUDRecordCollectionStore extends EventEmitter {

  /**
   * @param {flux.Dispatcher} dispatcher
   * @param {object} config { primaryKey:'id', url: '...', query: { ...search params... } }
   */
  constructor(dispatcher, config) {
    super();
    var that = this;
    this.config = config;
    this.primaryKey = config.primaryKey || 'id'
    this.records = {};
    this.dispatchToken = dispatcher.register(function(action) {
      switch(action.type) {
        case ActionTypes.ADD_RECORD:
          that.addRecord(action.index, action.record);
          break;
        case ActionTypes.REMOVE_RECORD:
          that.removeRecord(action.index)
          break;
        case ActionTypes.LOAD_RECORDS:
          that.loadRecords();
          break;
      }
    });
  }


  loadRecords() {
    var that = this;
    var primaryKey = this.config.primaryKey || 'id';
    this.records = {};
    $.getJSON(this.config.url, this.config.query || {}, function(records) {
      console.log('loaded records', records);
      if (records instanceof Array) {
        records.forEach(function(record) {
          var index = record[primaryKey];
          that.records[index] = record;
        });
      }
      that.emitChangeEvent();
    });
  }

  hasRecord(index) {
    return this.records[index] ? true : false;
  }

  addRecord(record) {
    var index = record[this.primaryKey];
    this.records[index] = record;
    this.emitChangeEvent();
  }

  removeRecord(record) {
    var index = record[this.primaryKey];
    delete this.records[index];
    this.emitChangeEvent();
  }

  removeAll() {
    this.records = {};
    this.emitChangeEvent();
  }

  objects() {
    var objs = [];
    for (var k in this.records) {
      objs.push(this.records[k]);
    }
    return objs;
  }

  keys() {
    return this.records.keys();
  }

  emitChangeEvent() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}
