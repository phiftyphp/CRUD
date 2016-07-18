var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

class CRUDBaseStore extends EventEmitter
{
  /********************************************
   * event related methods
   ********************************************/
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
