var BootstrapModalFactory = {};


// See: CRUDRelModal since ActionBootstrapHighlight is already an action plugin.
var CRUDBootstrapModal = {};
CRUDBootstrapModal.open = function(title, url, args, config) {

  var defer = jQuery.Deferred();
  var predefinedArgs = { "_submit_btn": false, "_close_btn": false };
  var controls = [];
  controls.push({
     "label": "儲存", "primary": true, "onClick": function(e, ui) { return ui.body.find("form").submit(); } 
  });

  // Replace the createBlock 
  var ui = ModalManager.createBlock($.extend({
    "title": title,
    "ajax": {
      "url":  url,
      "args": $.extend(predefinedArgs, args)
    },
    "controls": controls
  }, config||{}));

  // Initialize the action from the form inside the modal
  ui.dialog.on("dialog.ajax.done", function(e, ui) {
    var $form = ui.body.find("form");
    var form = ui.body.find("form").get(0);
    // create a new highlighter object to highlight the field
    var highlighter = new ActionBootstrapHighlight(form);
    var $msgbox = $form.prev('.action-result-container').first();
    var a = Action.form(form, {
      "clear": false,
      "onSubmit": function() {
        highlighter.cleanup();
      },
      "onSuccess": function(resp) {
        setTimeout((function() {
          // XXX: this weird, we have to find the .modal itself to close it
          // instead of using "ui.dialog"
          ui.container.find('.modal').modal('hide')
        }), 1000);
        defer.resolve(resp);
      },
      "onError": function(resp) {
        highlighter.fromValidations(resp.validations);
        defer.reject(resp);
      }
    });
    a.plug(ActionMsgbox, {
      'disableScroll': true,
      'container': $msgbox
    });
  });

  var $m = ui.container.find('.modal')
  $m.modal('show'); // TODO: support modal config here
  $m.on('shown.bs.modal', function(event) {
    // console.log('shown', event);
  });
  $m.on('hide.bs.modal', function(event) {
    // console.log('hide', event);
    ui.container.remove();
  });
  return defer;
};
export default CRUDBootstrapModal;
