

class AutoCompleteTaggingWidget
  constructor: (el, config) ->
    if typeof el == "string"
      @input = $(document.getElementById(id))
    else
      @input = $(el)
    dataconfig = @extractDataConfig()
    @config = $.merge dataconfig, config

  extractDataConfig: ->
    dataconfig =
      deleteAction: @input.data("delete-action")
      relation: @input.data("relation")
      container: @input.data("container")
      foreignKey: @input.data("foreign-key")
      foreignCreateAction: @input.data("foreign-create-action")
      foreignRecordPrimaryField: @input.data("foreign-record-primary-field")
      foreignRecordPrimaryKey: @input.data("foreign-record-primary-key")
      autocomplete:
        delay: @input.data("autocomplete-delay") or 100
        minLength: @input.data("autocomplete-min-length") or 1
        source: @input.data("autocomplete-source")

    recordsJson = @decodeEntities(@input.data("records"))
    if recordsJson and recordsJson.length > 2
      dataconfig.records = JSON.parse(recordsJson)
    return dataconfig

  decodeEntities: (str) ->
    d = document.createElement("div")
    d.innerHTML = str
    (if typeof d.innerText isnt "undefined" then d.innerText else d.textContent)

  renderExistingRecords: ->
    # for "{}"
    if @config.records and @config.records.length > 0
      for record in @config.records
        do (record) =>
          item = new CRUDList.NewTextItemView({ id: record.value }, { label: record.label }, {
            index: record.value
            deleteAction: @config.deleteAction
            relation: @config.relation
            onRemove: (e) ->
          })
          $item = item.render()
          $item.appendTo @getContainer()

  getContainer: () -> $(@config.container)

  addTag: (label, foreignId) ->
    self = this
    args = {}
    args[self.config.foreignKey] = foreignId
    item = new CRUDList.NewTextItemView(args, { label: label } , {
      relation: self.config.relation
      index: "new-" + foreignId
      onRemove: (e) ->
    })
    $item = item.render()
    $item.appendTo $(self.config.container)

  init: ->
    self = this

    @renderExistingRecords()

    $create = @input.next(".control-create")
    if $create.get(0) and @config.foreignCreateAction and @config.foreignRecordPrimaryField
      $create.click (e) =>
        args = {}
        args[ @config.foreignRecordPrimaryField ] = @input.val()

        @input.prop('disabled','disabled')

        runAction @config.foreignCreateAction, args, (resp) =>
          @addTag resp.data[@config.foreignRecordPrimaryField], resp.data[@config.foreignRecordPrimaryKey]
          @input.val("")
          @input.removeProp('disabled')
          @input.focus()

    @input.autocomplete
      delay: @config.autocomplete.delay
      minLength: @config.autocomplete.minLength
      source: @config.autocomplete.source
      select: (e, ui) ->
        args = {}
        args[self.config.foreignKey] = ui.item.id or ui.item.value
        item = new CRUDList.NewTextItemView(args, { label: ui.item.label } , {
          relation: self.config.relation
          index: "new-" + ui.item.id or ui.item.value
          onRemove: (e) ->
        })
        $item = item.render()
        $item.appendTo $(self.config.container)
        self.input.val ""
        self.input.focus()
        false
      focus: (e, ui) ->
        self.input.trigger "focus"

window.AutoCompleteTaggingWidget = AutoCompleteTaggingWidget


# Register intializer to region-js
$ ->
  findAndInit = (container) ->
    $(container).find('[data-widget="aut"]').each (i,el) ->
      aut = new AutoCompleteTaggingWidget(el, {})
      aut.init()
  $(Region).bind 'region.load', (e, reg) ->
    findAndInit(reg)
  findAndInit($(document.body))
