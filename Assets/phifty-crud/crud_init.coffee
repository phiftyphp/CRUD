###
#
# Initialize CRUD front-end component intiailziation
#
###
$ ->
  # TODO: use reactjs to render the widgets

  ### 
  # Here is the old way to append "create form"
  # Hook the record create button
  $(document).on "click", ".record-create-btn", (e) ->
    # .control-section
    # console.log ".control-section", $(this).parents(".control-section")
    # here is the logic controls how the "form" will be opened.
    Region.after $(this).parents(".control-section").get(0), $(this).data("create-region-url")
    return false
  ###

  $(document).on "click", ".record-create-btn", (e) ->
    console.log("create record", e)
    e.stopPropagation()
    # config.modal may contain the options to open a modal
    CRUDModal.openFromBtn $(this), config?.modal
    return false


  # initialize column sort buttons
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

  $('.date-picker').datepicker({ dateFormat: 'yy-mm-dd' })

  # bind components when region is ready
  $(Region).bind 'region.load', (e, $el) ->
    if typeof $.oembed isnt 'undefined'
      $el.find('.oembed').oembed(null, { maxHeight: 160 , maxWidth: 300 })

    $el.find('.date-picker').datepicker({ dateFormat: 'yy-mm-dd' })

    FormKit.initialize($el)

    # Display the first tab
    $el.find('.nav-tabs li:first-child a[data-toggle="tab"]').tab('show')

    # $el.find('.tabs').tabs()
    # $el.find('.tabs').easytabs()

    $el.find('.accordion').accordion({
      active: false
      collapsible: true
      autoHeight: false
    })

    # Initialize language section switch
    # Add lang-switch class name to lang select dropdown to initialize lang
    # switch feature
    $el.find('select[name=lang]').addClass('lang-switch')
    I18N.initLangSwitch($el)

    use_tinymce('adv1', { popup: true })

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
