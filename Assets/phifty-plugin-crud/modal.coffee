###
# This is a basic wrapper library around bootstrap-modal javascript.
#
# The use case is inside DMenu:
#
#     sectionModal = Modal.create({
#       title: if params.id then 'Edit Menu Section' else 'Create Menu Section'
#       ajax: {
#         url: '/dmenu/menu_section_form'
#         args: params
#         onReady: (e, ui) ->
#           form = ui.body.find("form").get(0)
#           Action.form form,
#             status: true
#             clear: true
#             onSuccess: (data) ->
#               ui.modal.modal('hide')
#               setTimeout (->
#                 self.refresh()
#                 ui.modal.remove()
#               ), 800
#               options.onSave() if options and options.onSave
#       }
#       controls: [
#         {
#           label: 'Save'
#           onClick: (e,ui) ->
#             ui.body.find("form").submit()
#         }
#       ]
#     })
#     $(sectionModal).modal('show')
#
###

window.Modal = {}

# Fetch modal content via ajax
window.Modal.ajax = (url, args, opts) ->

window.Modal.create = (opts) ->
  modal = document.createElement("div")
  modal.classList.add("modal")

  if opts?.side
    modal.classList.add("side-modal")

  dialog = document.createElement("div")
  dialog.classList.add("modal-dialog")

  content = document.createElement("div")
  content.classList.add("modal-content")

  header = document.createElement("div")
  header.classList.add("modal-header")

  closeBtn = $("<button/>").attr("type", "button").addClass("close")
  closeBtn.append( $("<span/>").html("&times;") )
  closeBtn.append( $("<span/>").addClass("sr-only").text('Close') )
  closeBtn.appendTo(header)
  closeBtn.click (e) -> $(modal).modal("hide")

  # <h4 class="modal-title">Modal title</h4>
  if opts.title
    $('<h4/>').text(opts.title).addClass('modal-title').appendTo(header)

  body = document.createElement('div')
  body.classList.add('modal-body')

  footer = document.createElement('div')
  footer.classList.add('modal-footer')

  eventPayload = { modal: $(modal), body: $(body), header: $(header) }

  # $('#myModal').modal('hide')
  if opts.controls
    for controlOpts in opts.controls
      do (controlOpts) =>
        $btn = $('<button/>').text(controlOpts.label).addClass('btn')
        $btn.addClass('btn-primary') if controlOpts.primary
        $btn.click((e) -> controlOpts.onClick(e, eventPayload) ) if controlOpts.onClick
        if controlOpts.close
          $btn.click (e) ->
            $(modal).modal('hide')
            controlOpts.onClose(e, eventPayload) if controlOpts.onClose

        $btn.appendTo(footer)

  content.appendChild(header)
  content.appendChild(body)
  content.appendChild(footer)

  dialog.appendChild(content)
  modal.appendChild(dialog)

  document.body.appendChild(modal)

  if opts.ajax and opts.ajax.url
    $(body).asRegion().load opts.ajax.url, opts.ajax.args, () ->
      opts.ajax.onReady(null, eventPayload) if opts.ajax.onReady
  return modal


###
Modal test code

$ ->
  testModal = Modal.create {
    title: 'Test Modal'
    controls: [
      { label: 'Test', primary: true, onClick: (e, ui) -> console.log(e, ui) }
      { label: 'Close', primary: true, close: true, onClose: (e, ui) -> console.log(e, ui) }
    ]
  }
  $(testModal).modal('show')
###
