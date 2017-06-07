
window.FiveKit = {} unless window.FiveKit

class window.FiveKit.UploadProgressItem
  constructor: (@file) ->
    @_total = 0
    @_loaded = 0
    @el = $('<div/>').addClass('fkit-progress')
    @progress = $('<progress/>')
    # @msg  = $('<div/>').addClass('message').appendTo( @el )
    if not @progress
      throw "progress element is not supported."
    @progress.attr({ value: @_loaded , max: @_total }).appendTo( @el )

    @percentage  = jQuery('<div/>').addClass('percentage').text(@file.size).appendTo( @el )

    @filedesc = $('<div/>').addClass('filedesc').appendTo(@el)

    @filesize = $('<div/>')
      .addClass('filesize')
      .text(@prettySize(@file.size ) )
      .appendTo(@filedesc)
    @filename = $('<div/>')
      .addClass('filename')
      .text(@file.name)
      .appendTo(@filedesc)

  setError: (error) ->
    @filedesc.append( $('<div/>').addClass('error').text(error) )

  # loaded(bytes), total(bytes)
  calculatePercentage: (loaded,total) -> parseInt((loaded / total) * 100)

  prettySize: (bytes) ->
    return bytes + 'B' if bytes < 1024
    return parseInt(bytes / 1024) + 'KB' if bytes < 1024 * 1024
    return parseInt(bytes / 1024 / 1024) + 'MB' if bytes < (1024 * 1024 * 1024)

  total: (@_total)   -> @progress.attr 'max', @_total

  loaded: (@_loaded) -> @progress.attr 'value', @_loaded

  updatePercentage: (loaded, total) ->
    p = @calculatePercentage( loaded, total )
    @percentage.text( p + '%' )

  update: (loaded,total) ->
    @loaded( loaded )
    @total( total )
    @updatePercentage( loaded, total )


