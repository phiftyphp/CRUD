// vim:sw=2:ts=2:sts=2:
window.SetPasswordControl = require("./components/SetPasswordControl");
window.DateRangeControl  = require("./components/DateRangeControl");
window.SingleDayControl  = require("./components/SingleDayControl");
window.CRUDCreateButton  = require("./components/CRUDCreateButton");
window.CRUDListEditor    = require("./components/CRUDListEditor");
window.CRUDHasManyEditor = require("./components/CRUDHasManyEditor");
window.CRUDRelModal      = require("./CRUDRelModal");
window.TableViewBuilder = require("./viewbuilder/TableViewBuilder");

function initMaterialDesign($region) {
  // for block styled checkbox, material doesn't work for inline checkbox
  if (typeof $.material !== "undefined") {
    $.material.checkbox($region.find('.checkbox > label > input[type=checkbox]'));
  }
}

function initOembed($region) {
  if (typeof jQuery.oembed === 'undefined') {
    return;
  }
  $region.find('.oembed').oembed(null, { maxHeight: 160 , maxWidth: 300 });
}

function initFormKit($region) {
  if (typeof FormKit === "undefined") {
    return;
  }
  FormKit.initialize($region);
}


function initCRUDCreateButton($region)
{
    const elements = $region.find('.crud-create-button');
    elements.each((i, el) => {
      console.debug('crud-create-button', i, el, el.dataset);
      const btn = React.createElement(CRUDCreateButton, el.dataset);
      ReactDOM.render(btn, el);
    });
}

function initCRUDPasswordControl($region) {
  const elements = $region.find('.crud-password-control');
  elements.each((i,el) => {
    console.debug('crud-password-control', i, el, el.dataset);
    const control = React.createElement(SetPasswordControl, {
      "required": elem.dataset["required"],
      "type": elem.dataset["type"]
    });
    ReactDOM.render(control, el);
  });
}

function initDatePicker($region) {
  if (typeof jQuery.fn.datepicker === "undefined") {
    return;
  }
  $region.find('.date-picker').datepicker({ dateFormat: 'yy-mm-dd' });
}

function initTabs($region) {

  // bootstrap tabs
  if (typeof jQuery.fn.tab !== "undefined") {
    $region.find('.nav-tabs li:first-child a[data-toggle="tab"]').tab('show');
  }

  // jQuery tabs plugin
  if (typeof jQuery.fn.tabs !== "undefined") {
    $region.find('.tabs').tabs();
  }
}

function initCollapsible($region) {
  if (typeof jQuery.fn.collapse === "undefined") {
    return;
  }
  $region.find(".collapsible").collapse();
}

function initAccordion($region) {
  if (typeof jQuery.fn.accordion === "undefined") {
    return;
  }

  // initialize accordion
  $region.find('.accordion').accordion({
    active: false,
    collapsible: true,
    autoHeight: false
  });
}

function initBundleI18NPlugin($region) {
  if (typeof I18N !== "undefined") {
    // Initialize language section switch
    // Add lang-switch class name to lang select dropdown to initialize lang
    // switch feature
    $region.find('select[name=lang]').addClass('lang-switch');
    I18N.initLangSwitch($region)
  } else {
    console.warn('I18N plugin is not loaded.');
  }
}

function initFieldHint($region) {
  $region.find(".v-field .hint").each(function(i, e) {
    var $hint = $(this);
    $hint.hide().css({ position: "absolute", zIndex: 100 });
    $hint.parent().css({ position: "relative" });
    $hint.prev().hover(function() { $hint.fadeIn() },
                       function() { $hint.fadeOut() });
  });
}

function initColorBox($region) {
  $region.find('.colorbox-inline').colorbox({
      inline: true,
      width: "50%",
      fixed: true,
      opacity: '0.5'
  });

  $region.find('.btn-close-colorbox').on('click', function (e) {
    e.preventDefault();
    $.fn.colorbox.close();
  });
}

window.initCRUDVendorComponents = function($region) {
  // init extra vendor components
  initFormKit($region);
  initOembed($region);
  initMaterialDesign($region);
  initDatePicker($region);
  initCollapsible($region);
  initColorBox($region);

  if (typeof use_tinymce !== "undefined") {
    use_tinymce('adv1', { popup: true });
  }
};

window.initCRUDComponents = function($region) {
  // init core components
  initCRUDPasswordControl($region);
  initCRUDCreateButton($region);

  // init bundle plugins
  initBundleI18NPlugin($region);
  initFieldHint($region);
};

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

