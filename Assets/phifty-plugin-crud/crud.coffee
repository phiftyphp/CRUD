###
vim:sw=2:ts=2:sts=2:
###


window.Phifty = {} unless window.Phifty

Phifty.CRUD =
  columnSortHandler: (o, name, sort_by) ->
    r = Region.of(o)
    r.refreshWith
      _order_column: name
      _order_by: sort_by
    return false

  closeEditRegion: (el) ->
    r = Region.of(el)
    if $.scrollTo
      $.scrollTo(r.getEl().parent() , 100, -> r.remove() )
    else
      r.remove()

  initEditRegion: ($el,opts) ->

    opts = $.extend({ removeRegion: true },opts)

    $(document.body).trigger('phifty.region_load')
    FormKit.initialize($el)
    $el.find('.tabs').tabs()
    $el.find('.accordion').accordion({
      active: false
      collapsible: true
      autoHeight: false
    })
    # initialize collapse when in ajax request.
    $el.find(".collapsible").collapse()

    if typeof $.oembed isnt 'undefined'
      $el.find('.oembed').oembed(null, { maxHeight: 160 , maxWidth: 300 })

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

To generate a image cover element with a hidden input of the primary key:

      coverView = new CRUDList.ImageItemView {
          deleteAction: "ProductBundle::Action::DeleteProductImage"
          relation: "images"
        }, { record json }
      coverView.appendTo( $('#productImages') )

Which generates the input name with

        name="images[id]" value="{primary id}"

###
window.CRUDList = CRUDList = {}


# Move to helper.coffee

window.InputHelper = {}
InputHelper.hiddenInput = (name,val) ->
  return $('<input/>').attr
      type: 'hidden'
      name: name
      value: val


###
#
# @data (hash): Contains anything you need.
#
# @uiSettings:
#   label (string)
#   labelBy (string)
#
# @config:
#   new (boolean)
#   primaryKey (string): for example, "id"
#   relation (string): for example, "product_images"
###
class CRUDList.NewBaseItemView
  constructor: (@data, @uiSettings, @config) ->
    # set default primary key to "id"
    @config.primaryKey = @config.primaryKey || "id"

  renderHiddenField: ($el, fieldName) ->
    console.log "renderHiddenField"
    pkId = @data[@config.primaryKey]
    val = @data[fieldName]
    index = if @config.index then @config.index else pkId
    return unless val

    if @config.relation
      # For existing records, we should use the primary key value of the junction record for the key field.
      # As the same as the value in the input.

      # For new records, we should generate unique numbers avoid conflict, e.g., `coupon_limited_products[9][product_id]`
      # Currently we're using product id as the field key for the new records.
      $el.append InputHelper.hiddenInput(@config.relation + "[#{index}][#{fieldName}]", val)
    else
      $el.append InputHelper.hiddenInput(fieldName, val)

  renderFields: ($el) ->
    for k,v of @data
      @renderHiddenField($el, k)
    return

  _render: () ->
    return @el if @el
    @el = @render()
    return @el

  append: (el) -> @_render().append(el)

  appendTo: (target) -> @_render().appendTo($(target))


class CRUDList.NewTextItemView extends CRUDList.NewBaseItemView
  render: ->
    config = @config
    data = @data
    label = @uiSettings.label or @data[ @uiSettings.labelBy ] or "Untitled"
    $cover = AdminUI.createTag
      label: label
      onRemove: (e) ->
        if config.deleteAction and data.id
          runAction config.deleteAction,
            { id: data.id },
            { confirm: '確認刪除? ', remove: $cover }
        else
          $cover.remove()
    @renderFields($cover)
    return $cover



class CRUDList.BaseItemView
  ###
  @config: the config.create
  ###
  constructor: (@config, @data, @crudConfig) ->
    @crudConfig ||= {}
    @config.primaryKey = @config.primaryKey || "id"

  createHiddenInput: (name,val) ->
    return $('<input/>').attr
      type: 'hidden'
      name: name
      value: val

  renderKeyField: () ->
    if @config.primaryKey and @data[@config.primaryKey]
      if @config.relation
        return @createHiddenInput(
          @config.relation + "[#{@data[@config.primaryKey]}][#{ @config.primaryKey }]",
          @data[@config.primaryKey])
      else
        return @createHiddenInput("id", @data[@config.primaryKey])

  appendTo: (target) -> @render().appendTo($(target))

class CRUDList.TextItemView extends CRUDList.BaseItemView
  render: ->
    config = @config
    data = @data
    $cover = AdminUI.createTextTag data,
      onClose: (e) ->
        if config.deleteAction and data.id
          runAction config.deleteAction,
              { id: data.id },
              { confirm: '確認刪除? ', remove: $cover }
        else
          $cover.remove()
    @renderKeyField()?.appendTo $cover
    return $cover


class CRUDList.FileItemView extends CRUDList.BaseItemView
  render: ->
    config = @config
    data = @data
    $cover = AdminUI.createFileCover(data)
    $close = $('<div/>').addClass('close').click ->
        if config.deleteAction and data.id
          runAction config.deleteAction,
              { id: data.id },
              { confirm: '確認刪除? ', remove: $cover }
        else
          $cover.remove()
    $close.appendTo($cover)
    $keyField = @renderKeyField()
    $keyField?.appendTo $cover
    return $cover

class CRUDList.ResourceItemView extends CRUDList.BaseItemView
  render: ->
    config = @config
    data = @data
    $cover = AdminUI.createResourceCover data,
      onClose: (e) ->
        runAction config.deleteAction,
          { id: data[config.primaryKey] },
          { confirm: '確認刪除? ', remove: this }
    $keyField = @renderKeyField()
    $keyField?.appendTo $cover
    return $cover

class CRUDList.ImageItemView extends CRUDList.BaseItemView
  render: ->
    self = this
    config = @config
    $cover = AdminUI.createImageCover
      thumb: @data.thumb
      image: @data.image
      title: @data.title
      onClose: (e) ->
        runAction config.deleteAction,
          { id: self.data[config.primaryKey] },
          { confirm: '確認刪除? ', remove: this }

    # The field "images[3][id]" for id
    $keyField = @renderKeyField()
    $keyField?.appendTo $cover
    return $cover


###

CRUDList.init({
  title: "產品附圖",
  hint: "您可於此處上傳多組產品副圖",
  container: $('#product-images'),
  crudId: "product_image",
  itemView: CRUDList.ImageItemView,
  create: {
    deleteAction: "ProductBundle::Action::DeleteProductImage",
    relation: "images",
  }
})

###
CRUDList.init = (config) ->
  itemViewClass = config.itemView
  
  if config.dialogOptions == undefined
    config.dialogOptions = {width: 650}

  $container = $(config.container)
  $imageContainer = CRUDList.createContainer()
  $createBtn = $('<input/>').attr({ type: "button" }).val("新增" + config.title).addClass("button-s").css({
    float: "right"
  }).click (e) ->
    dialog = new CRUDDialog "/bs/#{ config.crudId }/crud/dialog",{},
      dialogOptions:
        width: config.dialogOptions.width
      init: config.init
      beforeSubmit: config.beforeSubmit
      onSuccess: (resp) ->
        # if the itemViewClass is defined (which is a front-end template), use it.
        if itemViewClass
          coverView = new itemViewClass(config.create, resp.data, config)
          coverView.appendTo $imageContainer
        else
          # get the item view content and append to our container
          $.get "/bs/#{ config.crudId }/crud/item", {id: resp.data.id}, (html) -> $container.append(html)

  $title = $('<h3/>').text(config.title)
  $hint  = $('<span/>').text(config.hint).addClass("hint")

  CRUDList.renderRecords($imageContainer, config.records, config)

  $container.append($createBtn)
    .append($title)
    .append($hint)
    .append($imageContainer)

CRUDList.createContainer = () -> $('<div/>').addClass("clearfix item-container")

CRUDList.renderRecord = ($container, record, config) ->
  return unless record
  itemViewClass = config.itemView
  coverView = new itemViewClass(config.create, record, config)
  coverView.appendTo($container)

CRUDList.renderRecords = ($container, records, config) ->
  return unless records
  itemViewClass = config.itemView
  for record in records
    if itemViewClass
      coverView = new itemViewClass(config.create, record, config)
      coverView.appendTo $container
    else
      $.get "/bs/#{ config.crudId }/crud/item", {id: record.id}, (html) -> $container.append(html)
