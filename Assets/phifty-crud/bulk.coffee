### 
vim:sw=2:ts=2:sts=2:

Bulk Operation API

New BulkCRUD:

    productBulk = new BulkCRUD({
            container: $('#crud-list')
            menu: $('#menu')
            namespace: 'ProductBundle'
            model: 'Product'
    })
    productBulk.selectAll()
    productBulk.unselectAll()
    productBulk.runAction(...)

    productBulk.addPlugin new DeletePlugin(....)
    productBulk.addPlugin new CopyPlugin(....)

###

class BulkCRUD
  handlers: {}

  init: (@config) ->
    @container = @config.container
    @table = @config.table
    @menu = @config.menu
    @namespace = @config.namespace
    @model = @config.model

    @table.on "click", "tbody tr", (e) ->
      el = $(this).find('input[name="selected[]"]')
      if el.attr('checked')
        $(this).removeClass('selected')
        el.removeAttr('checked')
      else
        el.attr('checked','checked')
        $(this).addClass('selected')
      e.stopPropagation()

    @table.on "click", 'tbody input[name="selected[]"]', (e) ->
      e.stopPropagation()
      if $(this).attr('checked')
        $(this).parents("tr").addClass('selected')
      else
        $(this).parents("tr").removeClass('selected')

    @table.on "click", ".select-all", => @toggleSelect()

    openRecordEditModal = ($btn) ->
      id = $btn.data("record-id")
      section = $btn.parents(".section").get(0)
      e.stopPropagation()

      title = $btn.data("modal-title")
      size = $btn.data("modal-size")
      side = $btn.data("modal-side")

      ui = ModalManager.create({
        title: title
        side: side
        size: size
        ajax: {
          url: $btn.data("edit-url")
          args:
            _submit_btn: false
            _close_btn: false
            id: id
        }
        controls: [
          {
            label: 'Save'
            onClick: (e,ui) ->
              ui.body.find("form").submit()
          }
        ]
      })
      ui.dialog.on "dialog.ajax.done", (e, ui) ->
        # Initialize the modal form
        form = ui.body.find("form").get(0)
        $result = $('<div/>').addClass('action-result-container')
        $(form).before($result)

        # Setup Action form automatically
        a = Action.form form,
          status: true
          clear: true
          onSuccess: (resp) ->
            setTimeout (->
              # Remove the modal itself
              ui.dialog.foldableModal('close')
            ), 1000
        a.plug(ActionMsgbox, {
            container: $result
            fadeOut: false
        })
      # XXX: the config object is defined in the BulkCRUD's constructor
      ui.dialog.foldableModal(config?.modal or 'show')
      return ui

    # the region style editor
    #
    # @table.on "click", ".record-edit-btn", (e) ->
    #   Region.before section, $(this).data("edit-url"), { id: id }, this
    #   jQuery.get $(this).data("edit-url"), { id: id}, (html) ->
    #     $(document.body).append(html)

    # open a modal base on the data attributes defined on the record edit button elements
    @table.on "click", ".record-edit-btn", (e) ->
      openRecordEditModal $(this)
      return false

    @table.on "click", ".record-delete-btn", (e) ->
      e.stopPropagation()
      if not $(this).data("delete-action")
        console.error("data-delete-action undefined")
      id = $(this).data("record-id")
      csrf = $(this).data("csrf-token")
      runAction $(this).data("delete-action"), { 
        id: id
        _csrf_token: csrf 
      },
        confirm: "確認刪除? "
        removeTr: this


    @menu.empty()
    @menu.append( $('<option/>') )

    self = this
    @menu.change ->
      $select = $(this)
      val = $(this).val()
      # handler = $select.find(':selected').data('handler')
      handler = self.handlers[ val ]
      # call handler
      if handler
        handler.call(self,$select)
      $select.find('option').first().attr('selected','selected')

  getSelectedItems: () ->
    @container.find('input[name="selected[]"]:checked')

  getSelectedItemValues: () ->
    @getSelectedItems().map( (i,e) -> parseInt(e.value) ).get()

  unselectAll: () ->
    # TODO: use class instead of id
    @container.find('.select-all').val(0).removeAttr('checked')
    @container.find('input[name="selected[]"]').removeAttr('checked')
    @table.find('tbody tr').removeClass('selected')

  selectAll: () ->
    @container.find('.select-all').val(1).attr('checked','checked')
    @container.find('input[name="selected[]"]').attr('checked','checked')
    @table.find('tbody tr').addClass('selected')

  toggleSelect: () ->
    if @container.find('.select-all').val() is "1"
      @unselectAll()
    else
      @selectAll()

  sendAction: (action, params, cb) ->
    params = $.extend {
      "__action": action,
      "__ajax_request": 1
    }, params
    $.ajax
      url: '/bs',
      type: 'post',
      data: params,
      dataType: 'json',
      success: cb

  ###
  # Run bulk action on the selected items.
  #
  # @param actionName short action name
  ###
  runBulkAction: (action, extraParams, callback) ->
    fullActionName = @namespace + '::Action::Bulk' + action + @model
    return @runAction(fullActionName, extraParams, callback)

  runAction: (fullActionName, extraParams, callback) ->
    # the item id list
    items = @getSelectedItemValues()
    params = $.extend { items: items }, extraParams
    @sendAction fullActionName, params, callback

  addMenuItem: (op, label, cb) ->
    @handlers[ op ] = cb
    option = $('<option/>').text(label).val(op)
    @menu.find('[value="' + op + '"]').remove()
    @menu.append(option)
    option.data('handler', cb)

  addPlugin: (plugin) -> plugin.register(this)

window.BulkCRUD = BulkCRUD

class window.BulkCRUDDeletePlugin
  register: (bulk) ->
    bulk.addMenuItem 'delete', '刪除', (btn) =>
      if confirm("確定刪除 ?")
        bulk.runBulkAction 'Delete', {}, (result) ->
          if result.success
            $.jGrowl result.message
            Region.of(bulk.table).refresh()
            # Region.of(btn).refresh()
          else
            $.jGrowl result.message, theme: 'error'

class window.BulkCRUDCopyPlugin
  register: (bulk) ->
    bulk.addMenuItem 'copy', '複製...', (btn) ->
      content = $('<div/>')
      languages =
        '':'--為新語言--'
        en: '英文'
        zh_TW: '繁體'
        ja: '日文'
        zh_CN: '簡體'
      $langsel = $('<select/>')
      for lang,label of languages
        $langsel.append new Option(label,lang)

      runbtn = $('<input/>').attr( type: 'button' ).val('複製')
      runbtn.click ->
        bulk.runBulkAction 'Copy', { lang: $langsel.val() }, (result) ->
          if result.success
            $.jGrowl result.message
            setTimeout (->
              Region.of(bulk.table).refreshWith page: 1
              content.dialog 'close'
            ) , 800
          else
            $.jGrowl result.message, theme: 'error'
      content.attr(title: '複製').append($langsel).append(runbtn).dialog()

window.bulkCRUD = new BulkCRUD()
