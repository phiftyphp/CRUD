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
