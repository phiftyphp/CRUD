
###

By detecting drag behavior to show a dropbox area
And trigger actions after uploading files.

    dropboxAction = new DropBoxActionConnect({
      container: $('.dropbox-container')
      detector: $(document.body)
      uploadAction: 'CoreBundle::Action::Html5Upload'
      resultAction: 'ImageData::Action::CreateImage'
      resultHandler: (resp) ->
        console.log resp.message
      # or use onUpload
      onUpload: (resp) ->
    })

Dropbox element structure:

    <div class="dropbox-container">
        <div class="dropbox-queue"> </div>
        <div class="dropbox">Drag files to here to upload.</div>
    </div>

###
class window.FiveKit.DropBoxActConnection
  constructor: (@options) ->
    @container = @options.container
    @detector = $(@options.detector or document.body)
    @uploadAction = @options.uploadAction or 'CoreBundle::Action::Html5Upload'

    $queueEl = $('<div/>').addClass('dropbox-queue').appendTo( @container )
    $dropboxEl = $('<div/>').addClass('dropbox').appendTo( @container )
    $hint = $('<div/>')
      .addClass('dropbox-hint')
      .text('Drag files to here to upload')
      .appendTo($dropboxEl)

    @container.hide()

    self = this
    _timer = null

    @detector.bind 'dragenter', (e) ->
      self.container.fadeIn()

    # initialize dropbox
    @dropbox = new FiveKit.DropBoxUploader
      el: $dropboxEl
      queueEl: $queueEl
      action: @uploadAction

      onDragOut: (e) ->
        clearTimeout(_timer) if _timer
        _timer = setTimeout( (-> self.container.fadeOut('fast') ), 1000 * 3)

      onTransferFinished: (e) ->
        setTimeout( (->
          self.container.fadeOut('slow')
          self.options.onTransferFinished.apply(this,e) if self.options.onTransferFinished
        ), 900)

      onTransferComplete: (e,result) ->
        if self.options.onTransferComplete
          self.options.onTransferComplete.call(this,result)
        else if self.options.resultAction and self.options.resultHandler
          runAction self.options.resultAction, result.data , self.options.resultHandler
