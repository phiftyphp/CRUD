
# vim:sw=2:ts=2:sts=2:
class QuickCRUD
  constructor: (@element,@options) ->
    @selectInput = $(@element)

    @createButton = $('<button/>').text('新增').click (e) =>
      @create()
      return false

    @deleteButton = $('<button/>').text('刪除').click (e) =>
      val = @selectInput.val()
      if val && confirm('確定刪除?')
        runAction @options.deleteAction, { id: val }, (resp) =>
          @selectInput.find("option[value=#{val}]").remove()
          @selectInput.trigger("change")
      return false

    self = this
    @selectInput.after( @createButton )
    # @selectInput.after( @deleteButton )
    @selectInput.change (e) ->
      val = $(this).val()
      if val
        self.deleteButton.show()
      else
        self.deleteButton.hide()

    if not @selectInput.val()
      @deleteButton.hide()

  create: () ->
    dialog = new CRUDDialog @options.dialogPath, {} ,
      dialogOptions:
        width: 400
      onSuccess: (resp) =>
        label = resp.data[ @options.dataLabelField ]
        val = resp.data[ @options.dataValueField ]
        @selectInput.find('option:selected').removeAttr('selected')
        $('<option/>')
          .text(label)
          .val(val)
          .attr('selected','selected')
          .appendTo( @selectInput )
        @selectInput.trigger("change")
window.QuickCRUD = QuickCRUD
