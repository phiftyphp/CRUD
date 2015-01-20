# Initialize the CRUD list
$ ->
  $(document).on "click", ".column-sort", (e) ->
    r = Region.of(this)
    r.refreshWith
      _order_column: $(this).data('sort-column')
      _order_by: $(this).data('sort-type')
    return false

  # quick search event
  $(document).on "change", ".crud-quicksearch", ->
    target = $(this).data("target")
    $(target).asRegion().refreshWith
      _q: @value
      page: 1

  # bind components when region is ready
  $(Region).bind 'region.load', (e, $el) ->
    if typeof $.oembed isnt 'undefined'
      $el.find('.oembed').oembed(null, { maxHeight: 160 , maxWidth: 300 })

    FormKit.initialize($el)

    $el.find('.tabs').tabs()

    $el.find('.accordion').accordion({
      active: false
      collapsible: true
      autoHeight: false
    })

    # initialize collapse when in ajax request.
    $el.find(".collapsible").collapse()

    $el.find(".v-field .hint").each (i, e) ->
      $hint = $(this)
      $hint.hide().css
        position: "absolute"
        zIndex: 100

      $hint.parent().css position: "relative"
      $hint.prev().hover (->
        $hint.fadeIn()
      ), ->
        $hint.fadeOut()
