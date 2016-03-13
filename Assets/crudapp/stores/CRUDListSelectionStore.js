var constants = require('../constants/CRUDListConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = constants.ActionTypes;

var CHANGE_EVENT = 'change';

export default class CRUDListSelectionStore extends EventEmitter {
  constructor(context) {
    super();
    var that = this;
    this.selections = {};
    this.dispatchToken = context.dispatcher.register(function(action) {
      switch(action.type) {
        case ActionTypes.DESELECT_RECORD:
          that.removeSelection(action.recordId);
          break;
        case ActionTypes.SELECT_RECORD:
          that.addSelection(action.recordId);
          break;
      }
    });
  }

  hasSelection(recordId) {
    return this.selections[recordId] ? true : false;
  }

  addSelection(recordId, record) {
    this.selections[recordId] = record || true;
    this.emitChangeEvent();
  }

  removeSelection(recordId) {
    delete this.selections[recordId];
    this.emitChangeEvent();
  }

  clearSelection() {
    this.selections = {};
    this.emitChangeEvent();
  }

  getSelection() {
    var keys = [];
    for (var key in this.selections) {
      keys.push(parseInt(key));
    }
    return keys;
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
