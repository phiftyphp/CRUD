window.CRUDModal = {}

ControlBuilder =
  primaryButtonClass: "btn btn-primary btn-success"

ControlBuilder.createButton = (label, config) ->
  btn = document.createElement('button')
  btn.innerText = label
  btn.className = this.primaryButtonClass
  return btn

###

A CRUDModal presents the record form in a modal. There will be at least a
submit button, close button and extra custom buttons.

Users may also register customzied controls to the modal.


Create a bootstrap modal with the ajax content.

Options
================

title (string): title of the modal
side (boolean): if it's a side modal
size (string): size of the modal, css class name
id (integer): the record id.
url (string):  the url of ajax content
controls (array): the config for creating controls

Callback options
----------------

init (function): the callback for initializing modal content.
success (function): this callback will be triggered when the form is submited successfully.


Example
=================

    CRUDModal.open({
      "title": "建立新的" + this.props.modelLabel,
      "size": "lg",
      "side": true,
      "url": "/bs/org/crud/create",
      "init": function(e, ui) {
        // the modal content init callback
        console.log("modal content is ready to be initialized.")
      },
      "success": function(ui, resp) {
        console.log("form is submitted successfully")
      }
    })

###

CRUDModal.open = (config, modalConfig) ->
  saveButton =
    label: '儲存'
    primary: true
    onClick: (e,ui) -> ui.body.find("form").submit()

  defaultControls = [saveButton]

  ajaxConfig =
    url: config.url
    args:
      _submit_btn: false
      _close_btn: false

  # Override the default config arguments for ajax page
  ajaxConfig.args = config.args if config.args

  # converts "record id" into ajax arguments
  ajaxConfig.args.id = config.id if config.id

  ui = ModalManager.create
    "title": config.title
    "side": config.side or false
    "size": config.size
    "ajax": config.ajax or ajaxConfig
    "controls": config.controls or defaultControls

  this._initBody(ui, config)

  # XXX: the config object is defined in the BulkCRUD's constructor
  ui.dialog.foldableModal(modalConfig or 'show')
  return ui


CRUDModal.update = (ui, opts) ->
  ModalFactory.update(ui, opts)
  this._initBody(ui, opts)


CRUDModal._initBody = (ui, config) ->
  # When ajax content is loaded, we initialize the form inside the modal.
  ui.dialog.on "dialog.ajax.done", (e, ui) ->
    config.init(e, ui) if config.init

    form = ui.body.find("form").get(0)

    setupForm = (ui, form) ->
      $result = $('<div/>').addClass('action-result-container')
      $(form).before($result)

      # Update the result message container in the modal.
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
        clear: false
        onSuccess: (resp) ->
          config.success(ui, resp) if config.success
          # Remove the modal when action is executed successfully.
          if config.closeOnSuccess
            setTimeout (-> ui.dialog.foldableModal('close')), 1000
      a.plug(new ActionBootstrapHighlight)
      a.plug(new ActionMsgbox({
        container: $result
        fadeOut: false
      }))
    setupForm(ui, form) if form

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
    "title": title
    "size": size
    "side": side
    "closeOnSuccess": true
    "url": $btn.data("edit-url")
    "id": id
  })

