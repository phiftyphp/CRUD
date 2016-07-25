var assign = require('object-assign');
var constants = require('../constants/CRUDStoreActionIds');
var ActionTypes = constants.ActionTypes;
var EventEmitter = require('events').EventEmitter;
var CHANGE_EVENT = 'change';

import CRUDStore from "./CRUDStore";

/**
 * CRUDRecordCollectionStore loads records from CRUDHandler
 *
 * this class provides addRecord, removeRecord
 */
export default class CRUDRecordCollectionStore extends CRUDStore { }
