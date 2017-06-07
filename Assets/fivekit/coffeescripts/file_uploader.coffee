
window.FiveKit = {} if typeof window.FiveKit is "undefined"

###

Usage

  uploader = new FiveKit.FileUploader
    endpoint: "/bs"
    action: @options.action
    progressContainer: @queueEl
    onReadyStateChange: @options.onReadyStateChange
    onTransferProgress: @options.onTransferProgress
    onTransferComplete: @options.onTransferComplete
    onTransferFinished: @options.onTransferFinished
    onTransferStart:    @options.onTransferStart
  uploader.upload(e.dataTransfer.files)



  fileUploader = new FiveKit.FileUploader
    endpoint: "/bs"
    action: @options.action
    onTransferComplete: (e, result) -> console.log("onTransferComplete", e, result)
  fileUploader.upload(e.target.files[0])


###
class FiveKit.FileUploader
  actionClass: "CoreBundle::Action::Html5Upload"

  constructor: (@config) ->
    @actionClass = @config.action if @config.action
    @progressContainer = @config.progressContainer

  upload: (file) ->
    defer = $.Deferred()
    ActionCsrfToken.get success: (csrfToken) =>
      rs = @uploadFile(csrfToken, file)
      promise = $.when.apply($, [rs])
      promise.done (e,response) =>
        @config.onTransferFinished(e,response) if @config.onTransferFinished
        defer.resolve(e,response)
      promise.fail (e,response) =>
        defer.reject(e,response)
    return defer

  ###
  # @param file
  ###
  uploadFile: (csrfToken, file) ->
    self = this

    # create progress container element if it's given.
    if @progressContainer
      progressItem = new FiveKit.UploadProgressItem(file)
      progressItem.el.appendTo(@progressContainer)

    xhr = new FiveKit.Xhr
      endpoint: @config.endpoint
      params: {
        __action: @actionClass
        __ajax_request: 1
        __csrf_token: csrfToken
      }
      onReadyStateChange: (e) ->
        console.debug('onReadyStateChange',e) if window.console
        self.config.onReadyStateChange.call(this,e) if self.config.onReadyStateChange

      onTransferStart : (e) ->
        console.debug('onTransferStart', e) if window.console
        self.config.onTransferStart.call(this,e) if self.config.onTransferStart

      onTransferProgress: (e) ->
        console.debug('onTransferProgress',e) if window.console
        self.config.onTransferProgress.call(this,e) if self.config.onTransferProgress

        if e.lengthComputable
          position = (e.position or e.loaded)
          total = (e.totalSize or e.total)
          console.log('progressing',e, position , total ) if window.console
          progressItem.update(position, total) if progressItem
      onTransferComplete: (e, result) ->
        self.config.onTransferComplete.call(this, e, result, progressItem)
    return xhr.send(file)
