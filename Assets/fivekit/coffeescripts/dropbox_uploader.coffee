
window.FiveKit = {} if typeof window.FiveKit is "undefined"

###

DropBoxUploader
  + DropBox
  + FileUploader

  uploader = new FiveKit.DropBoxUploader({
    el:
    onDragIn:
    onDragOut:
    onDrop:
    onTransferComplete:
    onTransferProgress:
  });
###
class FiveKit.DropBoxUploader
  constructor: (@options) ->

    @dropboxEl = @options.el
    @queueEl = @options.queueEl
    if not @queueEl
      @queueEl = $('<div/>').addClass('dropbox-queue').before(@options.el)

    options = @options
    @dropbox = new FiveKit.DropBox({
      el: @dropboxEl
      debug: true
      onDragIn: @options.onDragIn
      onDragOut: @options.onDragOut
      onDrop: (e) =>
        # support files
        ###
        file object:
          lastModifiedDate:
          name:
          size:
          type: image/png
          webkitRelativePath: ""
        ###
        @options.onDrop.call(this,e) if @options.onDrop

        if e.dataTransfer?.files
          uploader = new FiveKit.BatchFileUploader
            endpoint: "/bs"
            action: @options.action
            progressContainer: @queueEl
            onReadyStateChange: @options.onReadyStateChange
            onTransferProgress: @options.onTransferProgress
            onTransferComplete: @options.onTransferComplete
            onTransferFinished: @options.onTransferFinished
            onTransferStart:    @options.onTransferStart
          uploader.upload(e.dataTransfer.files)
        return false
    })

