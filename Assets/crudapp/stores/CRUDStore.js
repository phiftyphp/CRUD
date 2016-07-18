import CRUDBaseStore from "./CRUDBaseStore";

/**
 * CRUDStore defines the basic functions for CRUD.
 */
class CRUDStore extends CRUDBaseStore
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
    let params = Object.create(this.params, _params);
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



}

