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

// backward compatibility for older React
// might be able to be removed.
if (typeof ReactDOM === "undefined") {
  ReactDOM = { render: React.render.bind(React) };
}

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
  if (typeof FormKit === 'undefined') {
    console.warn('FormKit is not loaded.');
  } else {
    FormKit.install();
  }

  console.debug('crudapp ready');
  initCRUDComponents($(document.body));
  // initCRUDVendorComponents();

  $(document).bind('drop dragover', function (e) {
      e.preventDefault();
  });
});
