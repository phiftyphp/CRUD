###

CRUDModal.openFromBtn depends on data attributes:

- data-modal-title: modal title
- data-modal-side: display as a side modal?
- data-modal-size: modal size size
- data-edit-url: the url of the content to be embedded.

This method reads the attributes from button element and open the CRUD form in
a modal.

modalConfig will be used when you need to define modal options.

###
window.CRUDModal = {}
CRUDModal.openFromBtn = ($btn, modalConfig) ->
  id      = $btn.data("record-id")

  # console.error("missing data-record-id attribute") unless id

  title = $btn.data("modal-title") or "Untitled"
  size = $btn.data("modal-size")
  side = $btn.data("modal-side")

  ui = ModalManager.create({
    title: title
    side: side
    size: size
    ajax: {
      url: $btn.data("edit-url")
      args:
        _submit_btn: false
        _close_btn: false
        id: id
    }
    controls: [
      {
        label: 'Save'
        primary: true
        onClick: (e,ui) -> ui.body.find("form").submit()
      }
    ]
  })
  ui.dialog.on "dialog.ajax.done", (e, ui) ->
    # Initialize form in the modal
    form = ui.body.find("form").get(0)
    $result = $('<div/>').addClass('action-result-container')
    $(form).before($result)

    # Setup Action form automatically
    a = Action.form form,
      status: true
      clear: true
      onSuccess: (resp) ->
        setTimeout (->
          # Remove the modal itself
          ui.dialog.foldableModal('close')
        ), 1000
    a.plug(ActionMsgbox, {
        container: $result
        fadeOut: false
    })
  # XXX: the config object is defined in the BulkCRUD's constructor
  ui.dialog.foldableModal(modalConfig or 'show')
  return ui
