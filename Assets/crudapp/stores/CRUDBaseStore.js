var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';


/**
 * CRUDBaseStore defines the basic functions for CRUD
 */
export default class CRUDBaseStore extends EventEmitter
{
  /**
   * config:
   * - baseUrl: {string} a CRUD handler could be mount to any base url.
   * - page: {number} the start page.
   * - pageSize: {number} the page size.
   * - params: {object} the default parameters that will be used in *every* request.
   */
  constructor(config) {
    super();
    this.config = config;
    // the default params that will be used in *every* request.
    this.params = config.params || {};
    this.currentPage = config.page || 1;
    this.baseUrl = config.baseUrl;
    this.records = {};
  }

  /**
   * the search API doesn't change the data defined in the store, it returns a
   * jQuery.Deferred object and you can setup a done callback on it.
   *
   * @param {Function} callback: (records, done) { done(); }
   * @return {jQuery.Deferred}
   */
  search(_params) {
    let $deferred = jQuery.Deferred();
    let params = this.buildParams(_params);
    $.getJSON(this.getSearchUrl(), params, (response) => {
      if (response instanceof Array) {
        $deferred.resolve(response, this.emitChangeEvent.bind(this));
      } else {
        $deferred.reject(response);
      }
    });
    return $deferred;
  }

  /**
   * Build request parameters
   *
   * merge the default parameters and the overrides.
   */
  buildParams(_params) {
    return Object.assign(this.params, _params);
  }

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
