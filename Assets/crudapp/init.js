
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
    console.warn("FormKit is not loaded, please load 'formkit' asset.");
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
    console.warn("jQuery.datepicker is not loaded");
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
    console.warn("jQuery.collapse is not loaded");
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

export function initCRUDVendorComponents($region) {
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

export function initCRUDComponents($region) {

  // init core components
  initCRUDPasswordControl($region);
  initCRUDCreateButton($region);

  // init bundle plugins
  initBundleI18NPlugin($region);
  initFieldHint($region);
};

export function initCRUDModalAction(currentFormId) {
    const formEl = document.getElementById(currentFormId);

    console.debug('setting up form validation for ',formEl);

    const highlighter = new ActionBootstrapHighlight(formEl);
    const $form = $(formEl);
    const $msgbox = $form.prev('.action-result-container').first();
    const a = Action.form(formEl, {
        'clear': false,
        'onSubmit': function() {
            highlighter.cleanup();
        },
        'onSuccess': function(resp) {
            jQuery.scrollTo(formEl, 600, { offset: -200 });
            // TODO: redirect?
        },
        'onError': function(resp) {
            highlighter.fromValidations(resp.validations);
            if (typeof jQuery.scrollTo != "undefined") {
                const input = highlighter.getFirstInvalidField();
                if (input) {
                    jQuery.scrollTo(input, 600, { offset: -200 });
                } else {
                    jQuery.scrollTo($msgbox.get(0), 600, { offset: -200 });
                }
            }
        }
    });
    a.plug(ActionMsgbox, {
        'disableScroll': true,
        'container': $msgbox
    });
};
