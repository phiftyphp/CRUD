###

new Phifty.CRUDChooser('/=/product_feature/chooser/list.json',{  },{ 
 onChoose: function(el) {  },
 listBuilder: function(items) {  }
})

###
class Phifty.CRUDChooser

  # @path: list.json
  constructor: (path,args,@opts) ->
    if $('.ui-dialog').get(0)
      $('.ui-dialog').remove()
    @dialog = $('<div/>')
    $.getJSON path,args,(items) =>
      if @opts.listBuilder
        @opts.listBuilder.apply(@,[items]).appendTo(@dialog)
      else
        @buildList(items).appendTo(@dialog)
        @dialog.dialog({
          minWidth: 450,
          modal: true
        })

  bindOnChoose: ($el,item) ->
    $el.click (e) =>
      @opts.onChoose.apply(@,[item]) if @opts.onChoose
      @dialog.dialog('close')

  buildList: (items) ->
    $ul = $('<ul/>').addClass('crud-chooser')
    for item in items
      do (item) =>
        $li = $('<li/>')
        $a = $('<a/>').text(item.label).appendTo($li)
        @bindOnChoose($a,item)
        $li.appendTo($ul)
    return $ul
