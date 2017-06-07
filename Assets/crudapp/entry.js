// vim:sw=2:ts=2:sts=2:
window.SetPasswordControl = require("./components/SetPasswordControl");
window.DateRangeControl  = require("./components/DateRangeControl");
window.SingleDayControl  = require("./components/SingleDayControl");
window.CRUDCreateButton  = require("./components/CRUDCreateButton");
window.CRUDListEditor    = require("./components/CRUDListEditor");
window.CRUDHasManyEditor = require("./components/CRUDHasManyEditor");
window.CRUDRelModal      = require("./CRUDRelModal");
window.TableViewBuilder = require("./viewbuilder/TableViewBuilder");

import {initCRUDVendorComponents, initCRUDComponents, initCRUDModalAction} from "./init";

window.initCRUDComponents = initCRUDComponents;
window.initCRUDVendorComponents = initCRUDVendorComponents;
window.initCRUDModalAction = initCRUDModalAction;

// Unmount app manually when region is going to fetch new contents.
$(Region).bind('region.unmount', function(e, $region) {
  $region.find('.react-app').each(function() {
    const unmount = React.unmountComponentAtNode(this);
  });
});

$(Region).bind('region.load', function(e, $region) {
  initCRUDComponents($region);
  initCRUDVendorComponents($region);
});

$(function() {
  console.debug('crudapp ready');
  initCRUDComponents($(document.body));
  // initCRUDVendorComponents();
});
