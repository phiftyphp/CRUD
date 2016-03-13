var keyMirror = require('keymirror');

// Define action constants
module.exports = {
  "ActionTypes": keyMirror({
    FILTER_CHANGE: null,
    SELECT_RECORD: null,
    DESELECT_RECORD: null,
    CHANGE_PAGE_SIZE: null,
    CHANGE_PAGE: null,
    SUMMARY_UPDATE: null
  })
};
