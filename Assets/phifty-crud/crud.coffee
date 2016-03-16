###
vim:sw=2:ts=2:sts=2:
###
window.Phifty = {} if typeof window.Phifty is "undefined"
window.CRUD = {} if typeof window.CRUD is "undefined"

CRUD = Phifty.CRUD =
  closeEditRegion: (el) ->
    r = Region.of(el)
    if $.scrollTo
      $.scrollTo(r.getEl().parent() , 100, -> r.remove() )
    else
      r.remove()

  initEditRegion: ($el,opts) ->
    $(document.body).trigger('phifty.region_load')

    opts = $.extend({ removeRegion: true },opts)

    # $(".crud-edit").find("select, input:checkbox, input:radio, input:file, input:text, input:submit, input:button").uniform();
    if opts.defaultTinyMCE
      use_tinymce('adv1')

    actionOptions = $.extend({
      clear: false,
      onSuccess: (resp) ->
        self = this
        if opts.removeRegion
          r = Region.of(self.form())
          if r
            if r.triggerElement
              Region.of(r.triggerElement).refresh()
            r.remove()
    }, opts.actionOptions or {})

    $el.find('.ajax-action').each (i,f) ->
      a = Action.form(f, actionOptions)
      opts.setupAction(a) if opts.setupAction

  ###
  $imageCover = AdminUI.createImageCover { image:..., thumb: ..., title:...  },
    onClose: (e) ->
      runAction 'Product::Action::DeleteProductImage',
        { id: data.id },
        { confirm: '確認刪除? ', remove: this }

  ###
  createImageCover: (opts) ->
    # insert image id into product field
    $imageCover = $('<div/>').addClass('image-cover')
    $a = $('<a/>').attr( target: '_blank', href: '/' + opts.image )

    $image = $('<img/>').attr( src: '/' + opts.thumb ).appendTo($a) if opts.thumb

    $cut = $('<div/>').addClass('cut').append($a).appendTo($imageCover)
    $title = $('<div/>').addClass('title').html( opts.title || '未命名' ).appendTo($imageCover)
    if opts.onClose
      $close = $('<div/>').addClass('close').click -> opts.onClose.call($imageCover)
      $close.appendTo($imageCover)
    if $a.facebox
      $a.facebox({
          closeImage: '/assets/facebox/src/closelabel.png',
          loadingImage: '/assets/facebox/src/loading.gif'
      })
    return $imageCover

  createTag: (settings) ->
    $tag = $('<div/>').addClass('tag')
    $name = $('<div/>').addClass('label').html(settings.label).appendTo($tag)
    if settings.onRemove
      $('<i/>').addClass('control fa fa-remove').click(settings.onRemove).appendTo($tag)
    return $tag

  createTextTag: (data,options) ->
    $tag = $('<div/>').addClass( 'text-tag' )
    $name = $('<div/>').addClass( 'name' ).html( data.title or data.name ).appendTo($tag)
    if options.onClose
      $close = $('<i/>').addClass('fa fa-remove').click(options.onClose)
      $close.appendTo($tag)
    return $tag

  createResourceCover: (data,opts) ->
    $tag = $('<div/>').addClass( 'resource' )
    $preview = $('<div/>').appendTo($tag)
    if data.url
      try
        $preview.oembed(data.url , { maxHeight: 300, maxWidth: 300 })
      catch e
        console.error(e) if window.console
        $a = $('<a/>').attr target: '_blank', href: data.url
        $a.html(data.url)
        $preview.html($a)
    else if data.html
      $preview.html(data.html)
    if opts.onClose
      $close = $('<div/>').addClass('close')
      $close.click (e) -> opts.onClose.call($tag,e)
      $close.appendTo($tag)
    return $tag

  createFileCover: (data) ->
    $tag = $('<div/>').addClass( 'product-file' )
    $name = $('<a/>').addClass('name')
      .attr({ target: '_blank', href: '/' + data.file })
      .html( data.title or data.file.split('/').pop() )
    $icon = $('<div/>')

    if data.mimetype is 'application/pdf' or
    data.mimetype is 'application/msword' or
    data.mimetype is 'text/plain' or
    data.mimetype is 'text/html'
        $icon.addClass('ui-' + data.mimetype.replace('/','-') + '-32')
    else
        $icon.addClass('ui-unknown-32')
    $icon.appendTo($tag)
    $tag.append($name)
    return $tag
