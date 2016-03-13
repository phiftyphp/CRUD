var constants = require('../constants/CRUDListConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = constants.ActionTypes;

var CHANGE_EVENT = 'change';

export default class CRUDListSummaryStore extends EventEmitter {
  constructor(context) {
    super();
    this.summary = {};
    var that = this;
    this.dispatchToken = context.dispatcher.register(function(action) {
      switch(action.type) {
        case ActionTypes.SUMMARY_UPDATE:
          that.summary = action.summary;
          that.emitChangeEvent();
          break;
      }
    });
  }

  getSummary() {
    return this.summary;
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
