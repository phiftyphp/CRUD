// vim:sw=2:ts=2:sts=2:
import SetPasswordControl from "./components/SetPasswordControl";
import DateRangeControl  from "./components/DateRangeControl";
import SingleDayControl  from "./components/SingleDayControl";
import CRUDCreateButton  from "./components/CRUDCreateButton";
import CRUDEditButton  from "./components/CRUDEditButton";
import CRUDDeleteButton  from "./components/CRUDDeleteButton";
import CRUDEditDeleteButtonGroup from "./components/CRUDEditDeleteButtonGroup";
import CRUDListEditor    from "./components/CRUDListEditor";
import CRUDHasManyEditor from "./components/CRUDHasManyEditor";
import CRUDRelModal      from "./CRUDRelModal";
import TableViewBuilder from "./viewbuilder/TableViewBuilder";

window.SetPasswordControl        = SetPasswordControl;
window.DateRangeControl          = DateRangeControl;
window.SingleDayControl          = SingleDayControl;
window.CRUDCreateButton          = CRUDCreateButton;
window.CRUDEditButton            = CRUDEditButton;
window.CRUDDeleteButton          = CRUDDeleteButton;
window.CRUDEditDeleteButtonGroup = CRUDEditDeleteButtonGroup;
window.CRUDListEditor            = CRUDListEditor;
window.CRUDHasManyEditor         = CRUDHasManyEditor;
window.CRUDRelModal              = CRUDRelModal;
window.TableViewBuilder          = TableViewBuilder;

import {initCRUDVendorComponents, initCRUDComponents, initCRUDModalAction} from "./init";

window.initCRUDComponents = initCRUDComponents;
window.initCRUDVendorComponents = initCRUDVendorComponents;
window.initCRUDModalAction = initCRUDModalAction;

// backward compatibility for older React
// might be able to be removed.
if (typeof ReactDOM === "undefined") {
  ReactDOM = { render: React.render.bind(React) };
}


function loadRegions($body)
{
  $body.find('[data-region]').each(function(i, el) {
    if (el.dataset.defer) {
      return;
    }
    const path = el.dataset.region || el.dataset.path;
    if (path) {
      Region.load($(el), path, el.dataset.args || {});
    }
  });
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
  loadRegions($region);
});



$(function() {
  if (typeof FormKit === 'undefined') {
    console.warn('FormKit is not loaded.');
  } else {
    FormKit.install();
  }

  initCRUDComponents($(document.body));
  initCRUDVendorComponents($(document.body));

  $(document).bind('drop dragover', function (e) {
      e.preventDefault();
  });

  loadRegions($(document.body));
});
