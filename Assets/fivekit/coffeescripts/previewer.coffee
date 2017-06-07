###
Dependencies: FiveKit.Dropbox,
              FiveKit.FileReader,
              jQuery.exif.js
###

$ = jQuery
window.FiveKit = {} unless window.FiveKit

fixedEncodeURIComponent = (str) ->
  encodeURIComponent(str).replace /[!'()*]/g, (c) ->
    '%' + c.charCodeAt(0).toString(16)

CSS =
  url: (url) -> 'url(' + url.split('/').map(fixedEncodeURIComponent).join('/') + ')'

  # toCssBackgroundSize converts image dimension into 
  # background-size property value, "contain" by default
  backgroundSize: (d) ->
    return d.width + ' ' + d.height if typeof d is "object"
    return d if typeof d is "string"
    return "contain"

class window.FiveKit.Previewer

  # XXX: we may use dom hash to save these dom element objects
  # dom: {}

  constructor : (@options) ->
    @fileInput = $(@options.el)
    @fieldName = @fileInput.attr('name')

    # create a hidden input for saving the uploaded path
    #
    # .formkit-widget-thumbimagefile-hidden
    # create a hiddenFileInput for later use
    # why we have to reassign name attribute is because the form would use a key-value mapping 
    # to store fileds' information
    @hiddenInput = $('<input type="hidden" class="formkit-widget-thumbimagefile-hidden">')


    # find the parent widget container element
    @widgetContainer = @fileInput.parents(".formkit-widget-thumbimagefile")

    @widgetContainer.css
      position: "relative"

    # find the existing image cover
    @cover = @widgetContainer.find(".formkit-image-cover")
    @cover.css
      display: "block"
      margin: 0
      padding: 0

    # find cover image (note that cover wrapper can be empty)
    @coverImage = @cover.find('.image')
    @coverImage.css({ zIndex: 1 })

    @autoresizeCheckbox = @widgetContainer.find('.autoresize-checkbox')
    @autoresizeTypeSelector = @widgetContainer.find('.autoresize-type-selector')

    @initialize()

  initialize : () ->
    # .formkit-widget-thumbimagefile (original)
    @fileInput.on "change", (e) =>
      @use "file"
      # console.debug("File selected",e.target.files[0], e)
      fileUploader = new FiveKit.FileUploader
        endpoint: "/bs"
        action: @options.action
        onTransferComplete: (e, result) -> console.log("onTransferComplete", e, result)

      # @param {XMLHttpRequestProgressEvent} e xhr progress event
      # @param {object} result the returned data of the uploaded file.
      promise = fileUploader.upload(e.target.files[0])
      promise.done (e,result) =>
        @renderCoverImage("/" + result.data.file) if result.data?.file
      promise.fail (e,result) =>
        console.error(e, result)
        if typeof $.jGrowl isnt "undefined"
          $.jGrowl("Upload failed.", { theme: 'error' })

    @fileInput.after(@hiddenInput)

    # Resize preview cover
    d = @getImageDisplayDimension()

    # create a dropzone element
    $dropzone = $('<div/>').addClass('image-dropzone').css({
      position: 'absolute'
      zIndex: 2
    })
    @cover.before $dropzone

    @widgetContainer.css({ display: 'inline-block' })
    @widgetContainer.css(d) # update the container size

    # create image holder
    @updateCover(d)

    if @fileInput.data('imageSrc')
      @renderCoverImage(@fileInput.data('imageSrc'))

    if d and d.width and d.height
      @cover.css(@scalePreviewDimension(d))
      $dropzone.css(@scalePreviewDimension(d))
    else
      defaultDimension = { width: 240, height: 120 }
      @cover.css(defaultDimension)
      $dropzone.css(defaultDimension)



    # Finally, setup the dropbox uploader
    @initDropbox $dropzone

  updateCover: (d) ->
    if not @coverImage.get(0)
      @insertImageHolder(d)
    else
      @scaleCoverImageByDefault(d) if d
      # image cover html generated from backend does not contains
      # remove button and exif button.
      @_initCoverController()

  scalePreviewDimension: (d) ->
    if d.width > 350
      r = 350 / d.width
      d.width  *= r
      d.height *= r
    if d.height > 300
      r = 300 / d.height
      d.width  *= r
      d.height  *= r
    return d

  insertImageHolder: (d) ->
    # return unless d and d?.width and d?.height
    return if window.navigator.userAgent.match(/MSIE 8/)
    # holdertheme = "social"
    holdertheme = "auto"

    if d and d.width and d.height
      $imageholder = $('<img/>').attr("data-src", ["holder.js", d.width + "x" + d.height, holdertheme].join("/"))

      # resize the image if the size is too large.
      d = @scalePreviewDimension(d)
      $imageholder.css(d)
    else if d and (d.width or d.height)
      text = if d and d.width then d.width else "Any"
      text += " x "
      text += if d and d.height then d.height else "Any"
      $imageholder = $('<img/>').attr("data-src", ["holder.js", "240x120", "text:" + text, holdertheme].join("/"))
      $imageholder.css({ width: 240, height: 120 })
    else
      $imageholder = $('<img/>').attr("data-src", ["holder.js", "240x120", "text:Any Size", holdertheme].join("/"))
      $imageholder.css({ width: 240, height: 120 })

    @cover.append $imageholder
    if typeof Holder isnt "undefined"
      Holder.run images: $imageholder.get(0)
    else
      console.warn("Holder js is not installed.")

  getImageDisplayDimension: () ->
    d = { }
    d.width = @fileInput.data('displayWidth') if @fileInput.data('displayWidth')
    d.height = @fileInput.data('displayHeight') if @fileInput.data('displayHeight')
    if d.width and d.height
      return d
    d = {}
    d.width = @fileInput.data('width') if @fileInput.data('width')
    d.height = @fileInput.data('height') if @fileInput.data('height')
    return d

  getImageDimension: () ->
    d = { }
    d.width = @fileInput.data('width') if @fileInput.data('width')
    d.height = @fileInput.data('height') if @fileInput.data('height')
    return d

  initDropbox: (dropzone) ->
    # set + create DOM
    progressBarContainer = $('<div/>').addClass("upload-progress clearfix")
      .css({ marginTop: 5 })
    progressBarContainer.hide()

    @widgetContainer.after(progressBarContainer)

    uploader = new FiveKit.DropBoxUploader
      el: dropzone
      queueEl: progressBarContainer

      # hide the queue first
      onDrop: (e) =>
        progressBarContainer.empty().show()
        @renderPreviewImage(e.dataTransfer.files[0]) if ( e.dataTransfer.files?[0] )
        @fileInput.hide()

      # change with the img src from server
      onTransferComplete: (e, result, progressItem) =>
        @use('hidden')

        if result.success? and result.data?.file
          @renderUploadImage(result.data?.file)
          # fadeOut progress container after 1.2 second only when upload success
          setTimeout (-> progressBarContainer.fadeOut()), 2000
        else if result.error
          @removeCoverImage()
          @insertImageHolder(@getImageDimension())
          progressItem.setError(result?.message || "Upload Error")


  # runAction use 'name' attribute to recognize the which feild is going to be sent to server,
  # so we have to make 'name' attribute unique in previewer
  use: (type) ->
    if type is 'hidden'
      @hiddenInput.attr('name', @fieldName)
      @fileInput.attr('name', '')
      @fileInput.hide()
    else if type is 'file'
      @fileInput.attr('name', @fieldName)
      @fileInput.show()
      @hiddenInput.attr('name', '')

  scaleCoverImageByMaxWidth: (d) ->
    @coverImage.css { width: '100%', height: 'auto' } if @coverImage.width() > d.width

  scaleCoverImageByMaxHeight: (d) ->
    @coverImage.css { height: '100%', width: 'auto' } if @coverImage.height() > d.height

  scaleCoverImageByFullScale: (d) ->
    @coverImage.css { height: '100%', width: '100%' }

  scaleCoverImageByDefault: (d) ->
    if d and @coverImage.get(0)
      d = @scalePreviewDimension(d)
      @coverImage.css(d)
      # if @coverImage.height() > d.height
      #   @coverImage.css { height: '100%', width: 'auto' }
      # if @coverImage.width() > d.width
      #   @coverImage.css { width: '100%', height: 'auto' }


  removeCoverImage: () ->
    @cover.empty()
    @cover.css { backgroundImage: "none" }

  # src: image src path or base64 encoded content
  renderCoverImage: (src) ->
    @removeCoverImage()

    console.log("renderCoverImage", src, @cover)
    # first cleanup existing cover image
    self = this

    d = @getImageDimension()

    console.log(CSS.url(src))

    @coverImage = $('<div/>').appendTo @cover
    @coverImage.css({
      backgroundImage: CSS.url(src)
      backgroundSize: "cover"
      backgroundRepeat: "no-repeat"
    })
    @coverImage.css { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }

    ###
    @coverImage.on 'load', ->
      $(this).exifLoad()
      self.scaleCoverImageByDefault(d) if d
      $(this).fadeIn()
    ###
    @_initCoverController()
    return

  _initCoverController: () ->
    # TODO: Extract to css for this remove button
    removeButton = $(document.createElement('div')).addClass('remove')
      .css({
        'zIndex': 1000
        'position': 'absolute'
        'top': 3
        'right': 7
        'color': '#ffffff'
      })
    removeButton.append( $('<div/>').addClass('fa fa-times-circle') )

    removeButton.on 'click', (e) =>
      e.stopPropagation()

      @removeCoverImage()
      @use "file"
      @insertImageHolder(@getImageDimension())
      return false
    @cover.append removeButton

    if @fileInput.data('exif')
      exifButton = $('<div/>').addClass('exif').css('zIndex', 1000).appendTo @cover
      exifButton.on 'click', (e) ->
      exifData = $(this).exifPretty()
      if $.isEmptyObject( exifData ) or not exifData
          exifData = "No EXIF information"
      alert exifData

  renderUploadImage: (src) ->
    # the uploaded image path is relative, such as "upload/product1.png"
    # so we should prepend a prefix
    @renderCoverImage "/" + src
    @hiddenInput.val src

  # use file api to render preview image before the file is uploaded.
  # @file: local file path from drop elements
  #
  # TODO: for local files, we need to upload first to avoid CORS issue
  renderPreviewImage : (file) ->
    if file instanceof File
      # we can renderPreviewImage from input.onChange or dropzone.onDrop
      filereader = new FiveKit.FileReader
        onLoaded : (e) =>
          @renderCoverImage(e.target.result) # base64 encoded file content
          # take off original thumbimagefile input for uploading
      filereader.read(file)
    else if typeof file is "string"
      @renderCoverImage("/" + file) # base64 encoded file content
      # @fileInput.hide()

# combine with formkit
FormKit.register (e, scopeEl) ->
  $(scopeEl)
    .find('.formkit-widget-thumbimagefile input[data-droppreview=true]')
    .each (i, fileInput) ->
      previewer = new FiveKit.Previewer {el : $(fileInput)}
