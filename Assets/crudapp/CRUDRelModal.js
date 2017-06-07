/*
CRUDModal doesn't support different z-index
It was used to open the side modal.

This is different from the CRUDModal, we don't use scroll, since the modal is
smaller.

Usage:

    CRUDModal.open({
      "title": $btn.data("modalTitle") || "編輯" + this.props.modelLabel,
      "size": "large",
      "side": true,
      "closeOnSuccess": true,
      "url": this.props.baseUrl + "/crud/edit",
      "id": parseInt($btn.data("recordId")),
      "init": function(e, ui) {
        // the modal content init callback
      },
      "success": function(ui, resp) {
        // this will be triggered when the form is submitted successfully
        that.refs.region.updateRegion();
      }
    });

Originally implemented in bundles/crud/Assets/crud/crud_modal.coffee
*/
const CRUDRelModal = {};

CRUDRelModal.open = function(title, url, args, config) {

  var defer = jQuery.Deferred();
  var predefinedArgs = { "_submit_btn": false, "_close_btn": false };
  var defaultControls = [];

  defaultControls.push({
     "label": "儲存", "primary": true, "onClick": function(e, ui) { return ui.body.find("form").submit(); }
  });

  const ui = ModalManager.createBlock($.extend({
    "title": title,
    "size": "large",
    "controls": defaultControls,
    "ajax": {
      "url":  url,
      "args": $.extend(predefinedArgs, args)
    },
  }, config||{}));

  // Initialize the action from the form inside the modal
  ui.dialog.on("dialog.ajax.done", function(e, ui) {
    var $form = ui.body.find("form");
    var form = ui.body.find("form").get(0);
    var $msgbox = $form.prev('.action-result-container').first();
    var a = Action.form(form, {
      "clear": false,
      "onSuccess": function(resp) {
        setTimeout((function() {
          // XXX: this weird, we have to find the .modal itself to close it
          // instead of using "ui.dialog"
          ui.container.find('.modal').modal('hide')
        }), 1000);
        defer.resolve(resp);

        if (config.success) {
            config.success.call(this, ui, resp);
        }
      }
    });
    a.plug(new ActionBootstrapHighlight);
    a.plug(new ActionMsgbox({
      'disableScroll': true,
      'container': $msgbox
    }));
  });

  const $m = ui.container.find('.modal')
  $m.modal('show'); // TODO: support modal config here
  $m.on('shown.bs.modal', (event) => {

  });
  $m.on('hide.bs.modal', (event) => {
    ui.container.remove();
  });
  return defer;
};
export default CRUDRelModal;
