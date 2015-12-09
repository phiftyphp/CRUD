window.CRUDModal = {}

###

Create a bootstrap modal with the ajax content.

title (string): title of the modal
side (boolean): if it's a side modal
size (string): size of the modal, css class name
id (integer): the record id.
url (string):  the url of ajax content
controls (array): the config for creating controls

###
CRUDModal.open = (config, modalConfig) ->

  defaultControls = [
    {
      label: '儲存'
      primary: true
      onClick: (e,ui) -> ui.body.find("form").submit()
    }
  ]

  ajaxConfig = {
    url: config.url
    args:
      _submit_btn: false
      _close_btn: false
      id: config.id
  }

  ui = ModalManager.create({
    title: config.title or "Untitled"
    side: config.side or false
    size: config.size
    ajax: ajaxConfig
    controls: config.controls or defaultControls
  })
  ui.dialog.on "dialog.ajax.done", (e, ui) ->
    # Initialize form in the modal
    form = ui.body.find("form").get(0)
    $result = $('<div/>').addClass('action-result-container')
    $(form).before($result)


    scrollTimer = null
    $(ui.body).scroll (e) ->
      clearTimeout(scrollTimer) if scrollTimer

      # delay 100ms to update the position
      scrollTimer = setTimeout (->
        $result.css({ top: ui.body.get(0).scrollTop })
      ), 100

    # Setup Action form automatically
    a = Action.form form,
      status: true
      clear: true
      onSuccess: (resp) ->
        setTimeout (->
          # Remove the modal itself
          ui.dialog.foldableModal('close')
        ), 1000
    a.plug(ActionBootstrapHighlight, {  })
    a.plug(ActionMsgbox, {
        container: $result
        fadeOut: false
    })
  # XXX: the config object is defined in the BulkCRUD's constructor
  ui.dialog.foldableModal(modalConfig or 'show')
  return ui


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
CRUDModal.openFromBtn = ($btn, modalConfig) ->
  id    = $btn.data("record-id")
  title = $btn.data("modal-title")
  size = $btn.data("modal-size")
  side = $btn.data("modal-side")
  CRUDModal.open({
    "id": id
    "title": title
    "size": size
    "side": side
    "url": $btn.data("edit-url")
  })

