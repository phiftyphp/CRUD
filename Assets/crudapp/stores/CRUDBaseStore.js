var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

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
}
