###

DropBox (Handle for drag, drop events)

  new Html5Kit.DropBox({
    el: $('#dropbox')
    onDragIn: () ->
    onDragOver: () ->
    onDragOut: () ->
    onDrop: () ->
  });

###
window.FiveKit = {} if typeof window.FiveKit is "undefined"

class FiveKit.DropBox
  constructor: (@options) ->
    jQuery.event.props.push("dataTransfer")

    @el = $(@options.el)
    self = this

    # default handlers
    @el.on "dragenter", (e) ->
      # e.stopPropagation()
      # e.preventDefault()
      $(this).addClass('dropbox-drag-over')
      console.log('dropbox-drag-in') if self.options.debug and window.console
      self.options.onDragIn.call(this,e) if self.options.onDragIn
      return false

    @el.on "dragover", (e) ->
      self.options.onDragOver.call(this,e) if self.options.onDragOver
      return false

    @el.on "dragleave", (e) ->
      $(this).removeClass('dropbox-drag-over')
      console.log('dropbox-drag-out') if self.options.debug and window.console
      self.options.onDragOut.call(this,e) if self.options.onDragOut
      return false

    # use native addEventListener, it's faster
    # @el[0].addEventListener 'dragover', handlerDragOver , false
    @el.on "drop", (e) ->
      $(this).removeClass( 'dropbox-drag-over' )
      console.log('dropbox-drag-drop',e) if self.options.debug and window.console
      self.options.onDrop.call(this,e) if self.options.onDrop
      return false

