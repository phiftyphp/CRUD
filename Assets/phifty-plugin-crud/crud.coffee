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
        r = Region.of(self.form())
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

class CRUDList.BaseItemView
  constructor: (@config,@data) ->
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
    $cover = Phifty.AdminUI.createTextCover data,
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
    $cover = Phifty.AdminUI.createFileCover(data)
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
    $cover = Phifty.AdminUI.createResourceCover data,
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
    $cover = Phifty.AdminUI.createImageCover
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
      onSuccess: (resp) ->
        coverView = new itemViewClass(config.create, resp.data)
        coverView.appendTo $imageContainer

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
  coverView = new itemViewClass(config.create, record)
  coverView.appendTo $container

CRUDList.renderRecords = ($container, records, config) ->
  return unless records
  itemViewClass = config.itemView
  for record in records
    coverView = new itemViewClass(config.create, record)
    coverView.appendTo $container
