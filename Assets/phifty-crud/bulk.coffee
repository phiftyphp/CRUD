### 
vim:sw=2:ts=2:sts=2:

CRUDBulk maintains the record table and the related record operations like "Edit", "Delete" in each row.

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
    @csrfToken = @config.csrfToken

    self = this

    # reset the selection number
    $('.number-of-selected-items').text(0)


    # When user clicks on the row, we should also update the checkbox
    @table.on "click", "tbody tr", (e) ->
      e.stopPropagation()

      # click events happened on checkbox input or material checkbox should
      # have ignored.
      return if $(e.target).is("span.check") or $(e.target).is(".crud-bulk-select")

      # the logic here updates tr status to checkbox status
      $tr = $(this)

      # find the checkbox
      $check = $tr.find('.crud-bulk-select')
      if $check.is(':checked')
        $check.prop('checked', false)
        $tr.removeClass('selected active')
      else
        $check.prop('checked', true)
        $tr.addClass('selected active')
      self.updateNumberOfSelectedItems()

    # Listen to the change event of the checkbox input element, and change the current row selection
    @table.on "change", "input.crud-bulk-select", (e) ->
      e.stopPropagation()

      $input = $(this)
      $tr = $input.parents("tr")

      # "active" class is used for bootstrap
      if $input.is(':checked')
        $tr.removeClass('selected active')
      else
        $tr.addClass('selected active')
      self.updateNumberOfSelectedItems()

    @table.on "click", ".crud-bulk-select-all", (e) =>
      e.stopPropagation()
      @toggleSelectAll(e)


    ###
    # the region style editor
    #
    @table.on "click", ".record-edit-btn", (e) ->
      section = $btn.parents(".section").get(0)
      Region.before section, $(this).data("edit-url"), { id: id }, this
      jQuery.get $(this).data("edit-url"), { id: id}, (html) ->
        $(document.body).append(html)
    ###

    # open a modal base on the data attributes defined on the record edit button elements
    @table.on "click", ".record-edit-btn", (e) ->
      e.stopPropagation()

      # config.modal may contain the options to open a modal
      CRUDModal.openFromBtn $(this), config?.modal
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


  # Find elements that would display "number of selected items" over the whole
  # page.
  findNumberOfSelectedItems: -> $('.number-of-selected-items')

  updateNumberOfSelectedItems: ->
    $checked = @findSelectedCheckboxes()
    @findNumberOfSelectedItems().text($checked.size())

  findCheckboxes: () -> @container.find('input.crud-bulk-select')

  findSelectedCheckboxes: () -> @container.find('input.crud-bulk-select:checked')

  findSelectedItemValues: () -> @findSelectedCheckboxes().map( (i,e) -> parseInt(e.value) ).get()

  findSelectAllCheckbox: () -> @container.find('input.crud-bulk-select-all')

  unselectAll: (e) ->
    @findSelectAllCheckbox().prop('checked', false) unless e
    @findCheckboxes().prop('checked', false)
    @table.find('tbody tr').removeClass('selected active')
    @updateNumberOfSelectedItems()

  selectAll: (e) ->
    @findSelectAllCheckbox().prop('checked', true) unless e
    @findCheckboxes().prop('checked', true)
    @table.find('tbody tr').addClass('selected active')
    @updateNumberOfSelectedItems()

  toggleSelectAll: (e) ->
    if @findSelectAllCheckbox().is(":checked")
      @selectAll(e)
    else
      @unselectAll(e)

  sendAction: (action, params, cb) ->
    params = $.extend {
      "__action": action
      "__ajax_request": 1
      "_csrf_token": @csrfToken
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
    items = @findSelectedItemValues()
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
