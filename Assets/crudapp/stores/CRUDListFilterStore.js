var constants = require('../constants/CRUDListConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ActionTypes = constants.ActionTypes;

var CHANGE_EVENT = 'change';

export default class CRUDListFilterStore extends EventEmitter {

  constructor(context, filters) {
    super();
    this.path = "";
    this.args = filters || {};

    var that = this;
    this.dispatchToken = context.dispatcher.register(function(action) {
      switch(action.type) {
        case ActionTypes.FILTER_CHANGE:
          // merge arguments from the event of filter
          if (action.key) {
            that.setArg(action.key, action.value);
          } else if (action.args) {
            that.updateArgs(action.args);
          }
          break;
      }
    });
  }

  getArgs() { return this.args; }

  getPath() { return this.path; }

  setArg(key, val) {
    this.args[ key ] = val;
    this.emitChangeEvent();
  }

  getPage() {
    return this.args["page"];
  }

  getPageSize() {
    return this.args["pagenum"] || 10;
  }

  updateArgs(args) {
    for (var key in args) {
      this.args[ key ] = args[key];
    }
    this.emitChangeEvent();
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
