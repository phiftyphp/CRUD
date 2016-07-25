var keyMirror = require('keymirror');

// Define action constants
module.exports = {
  "ActionTypes": keyMirror({

    // add the specific record.
    ADD_RECORD: null,

    // remove the specific record.
    REMOVE_RECORD: null,

    // load the records from the current query.
    LOAD_RECORDS: null,

    // load more records and append on the end of the list by using push.apply
    APPEND_RECORDS: null,
  })
};
