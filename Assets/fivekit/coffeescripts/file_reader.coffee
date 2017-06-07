###

Simple FileReader for File API.

###
window.FiveKit = {} if typeof window.FiveKit is "undefined"

class FiveKit.FileReader
  constructor: (@options) ->
    @reader = new window.FileReader
    # Firefox 3.6, WebKit (default behavior)
    if @reader.addEventListener
      @reader.addEventListener 'loadstart' ,@options.onLoadStart ,false if @options.onLoadStart
      @reader.addEventListener 'load'      ,@options.onLoad      ,false if @options.onLoad
      @reader.addEventListener 'loadend'   ,@options.onLoaded    ,false if @options.onLoaded
      @reader.addEventListener 'abort'     ,@options.onAbort     ,false if @options.onAbort
      @reader.addEventListener 'error'     ,@options.onError     ,false if @options.onError
      @reader.addEventListener 'progress'  ,@options.onProgress  ,false if @options.onProgress
    else
      # Chrome 7 (older behavior, use event attribute)
      @reader.onloadend = @options.onLoaded if @options.onLoaded
      @reader.onerror = @options.onError if @options.onError
      @reader.onprogress = @options.onProgress if @options.onProgress
    @reader.onloadend = (e) ->
  read: (file) ->
    @reader.readAsDataURL(file)
  isSupported: () -> typeof window.FileReader isnt 'undefined'
