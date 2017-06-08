// vim:sw=2:ts=2:sts=2:




function convertDOMStringMapToObject(map)
{
  const obj = {};
  for (var key in map) {
    obj[key] = map[key];
  }
  return obj;
}

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

function initHolderJs($region)
{
    if (typeof Holder !== "undefined") {
      Holder.run({
        domain: 'crud.list'
      });
    }
}

function initFacebox($region)
{
    if (typeof jQuery.fn.facebox !== "undefined") {
        $region.find('a[rel*=facebox]').facebox({
            closeImage: '/assets/facebox/src/closelabel.png',
            loadingImage: '/assets/facebox/src/loading.gif'
        });
    }
}



function initFormKit($region) {
  if (typeof FormKit === "undefined") {
    console.warn("FormKit is not loaded, please load 'formkit' asset.");
    return;
  }
  FormKit.initialize($region);
}


function initCRUDDeleteButton($region)
{
    const elements = $region.find('.crud-delete-button');
    elements.each((i, el) => {
      const obj = convertDOMStringMapToObject(el.dataset);
      obj.region = $region;

      const btn = React.createElement(CRUDDeleteButton, obj);
      ReactDOM.render(btn, el);
    });
}


function initCRUDEditButton($region)
{
    const elements = $region.find('.crud-edit-button');
    elements.each((i, el) => {
      const obj = convertDOMStringMapToObject(el.dataset);
      obj.region = $region;

      const btn = React.createElement(CRUDEditButton, obj);
      ReactDOM.render(btn, el);
    });
}

function initCRUDCreateButton($region)
{
    const elements = $region.find('.crud-create-button');
    elements.each((i, el) => {
      console.debug('crud-create-button', i, el, el.dataset);

      const obj = convertDOMStringMapToObject(el.dataset);
      obj.region = $region;

      const btn = React.createElement(CRUDCreateButton, obj);
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
    console.warn("jQuery.accordion is not loaded");
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
  if (typeof I18N === "undefined") {
    console.warn('I18N plugin is not loaded.');
    return;
  }

  // Initialize language section switch
  // Add lang-switch class name to lang select dropdown to initialize lang
  // switch feature
  $region.find('select[name=lang]').addClass('lang-switch');
  I18N.initLangSwitch($region)
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
  if (typeof jQuery.fn.colorbox === "undefined") {
    console.warn('jquery.colorbox is not loaded.');
    return;
  }

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
  initFacebox($region);
  initHolderJs($region);
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
  initCRUDEditButton($region);
  initCRUDDeleteButton($region);

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
