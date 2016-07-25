
import CRUDBaseStore from "./CRUDBaseStore";

var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

/**
 * CRUDStore defines the basic functions for CRUD.
 */
export default class CRUDStore extends CRUDBaseStore
{
  getSearchUrl() {
    return this.baseUrl + "/search";
  }

  getPageSize() {
    return this.config.pageSize || 10;
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
        $deferred.resolve(response, this.emitChangeEvent);
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
    return Object.create(this.params, _params);
  }

  /**
   * Switch page to {page}
   *
   * @param {number} page page number.
   * @return {jQuery.Deferred}
   */
  page(page) {
    let params = Object.create(this.params, {
      page: this.currentPage,
      pagenum: this.getPageSize()
    });
    $.getJSON(this.getSearchUrl(), params, (response) => {
      if (response instanceof Array) {
        $deferred.resolve(response, this.emitChangeEvent);
      } else {
        $deferred.reject(response);
      }
    });
    return $deferred;
  }


  /**
   * @param {string}
   */
  load(id) {

  }


  getPrimaryKey() {
    return this.config.primaryKey || 'id';
  }

  /**
   * Return all objects
   */
  objects() {
    let objs = [];
    for (var k in this.records) {
      objs.push(this.records[k]);
    }
    return objs;
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
      let i = 0 , len = records.length;
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
    this.records[key] = record;
    this.emitChangeEvent();
  }


  /**
   * remove one record by the record object.
   *
   * @param {Object<Record>}
   */
  removeRecord(record) {
    const primaryKey = this.getPrimaryKey();
    var key = record[primaryKey];
    delete this.records[key];
    this.emitChangeEvent();
  }

  /**
   * Remove all records
   */
  removeAll() {
    this.records = {};
    this.emitChangeEvent();
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

