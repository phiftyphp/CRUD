###

ModalFactory.create(opts)

This method creates DOM structure for bootstrap modal. It doesn't handle the
modal operations like close or hide...

opts (options)

  title (string): the modal title in the modal header
  size (string):  the modal size
  side (boolean): side modal or not?
  ajax (object): ajax content modal
  controls (list): control buttons in the modal footer.
  foldable (boolean): enable fold button

You will have to handle the events if you want to call this API to create modals.
The events:

- `dialog.close`: function(ui)
- `dialog.fold`: function(ui)
- `dialog.ajax.done`: function(ui)

###

window.ModalFactory = {}

ModalFactory.create = (opts) ->
  dialog = document.createElement("div")
  dialog.classList.add("modal-dialog")

  content = document.createElement("div")
  content.classList.add("modal-content")

  header = document.createElement("div")
  header.classList.add("modal-header")


  modalbody = document.createElement('div')
  modalbody.classList.add('modal-body')

  footer = document.createElement('div')
  footer.classList.add('modal-footer')

  content.appendChild(header)
  content.appendChild(modalbody)
  content.appendChild(footer)
  dialog.appendChild(content)

  ui =
    dialog: $(dialog)
    body: $(modalbody)
    header: $(header)
    footer: $(footer)
    options: opts

  this._buildHeader(ui, opts)

  if opts?.side
    dialog.classList.add("side-modal")

  if opts?.size
    if opts.size is "large"
      dialog.classList.add("modal-lg")
    else if opts.size is "small"
      dialog.classList.add("modal-sm")
    else if opts.size is "medium"
      dialog.classList.add("modal-md")
    else if typeof opts.size is "string"
      dialog.classList.add(opts.size)


  this._buildFooter(ui, opts) if opts.controls
  this._buildContent(ui, opts)
  return ui

ModalFactory.update = (ui, opts) ->
  this._buildHeader(ui, opts) if opts.title
  this._buildContent(ui, opts) if opts.ajax or opts.content
  this._buildFooter(ui, opts) if opts.controls

ModalFactory._buildHeader = (ui, opts) ->
  ui.header.empty()

  headerControls = document.createElement("div")
  headerControls.classList.add("modal-header-controls")
  ui.header.append(headerControls)

  if opts.foldable
    foldBtn = $("<button/>").attr("type", "button").addClass("fold-btn")
    foldBtn.append( $("<span/>").addClass("fa fa-minus") )
    foldBtn.append( $("<span/>").addClass("sr-only").text('Fold') )
    foldBtn.appendTo(headerControls)
    foldBtn.click (e) -> ui.dialog.trigger('dialog.fold', [ui])

  $closeBtn = $("<button/>").attr("type", "button").addClass("close")
  $closeBtn.append( $("<span/>").addClass("fa fa-remove") )
  $closeBtn.append( $("<span/>").addClass("sr-only").text('Close') )

  $closeBtn.attr("data-dismiss", "modal")
  $closeBtn.attr("aria-label", "Close")

  $closeBtn.appendTo(headerControls)
  $closeBtn.click (e) -> ui.dialog.trigger('dialog.close',[ui])

  # <h4 class="modal-title">Modal title</h4>
  $title = $('<h4/>').addClass('modal-title')
  $title.text(opts.title) if opts.title
  $title.appendTo(ui.header)

ModalFactory._buildContent = (ui, opts) ->
  ui.body.empty()
  if opts.ajax
    this._buildAjaxContent(ui, opts)
  else if opts.content
    ui.body.html(opts.content)

ModalFactory._buildAjaxContent = (ui, opts) ->
  alert("opts.ajax.url is not defined.") if not opts.ajax.url
  ui.body.asRegion().load opts.ajax.url, opts.ajax.args, () ->
    ui.dialog.trigger('dialog.ajax.done', [ui])

ModalFactory._buildFooter = (ui, opts) ->
  ui.footer.empty()
  for controlOpts in opts.controls
    do (controlOpts) =>
      $btn = $('<button/>').text(controlOpts.label).addClass('btn')
      $btn.addClass('btn-primary') if controlOpts.primary
      if controlOpts.close
        $btn.click (e) -> $(dialog).trigger('dialog.close',[ui])
      else
        $btn.click (e) -> controlOpts.onClick(e, ui) if controlOpts.onClick
      $btn.appendTo(ui.footer)

ModalFactory.createContainer = () ->
  modal = document.createElement("div")
  modal.classList.add("modal-container")
  return modal
