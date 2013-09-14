
class TChooser
  menu: []
  constructor: (@opts) ->
    if @opts.ajax
      $.getJSON @opts.ajax , (options) =>
        @showMenu(options)
    else
      @showMenu(@opts.options)

  showMenu: (options) ->
    @dialog = $('<div/>')

    # render options
    $menu = @renderOptions options
    @dialog.append($menu)
    @menu.push $menu
    @open()
  open: () ->
    w = $(window).width()
    h = $(window).height()
    @dialog.dialog({
      width: w - 200
      height: h - 100
    })
  close: () ->
    @dialog.dialog('close')

  currentMenu: () -> @menu[ @menu.length - 1 ] if @menu

  renderOptions: (options) ->
    self = this
    $menuWrapper = $('<div/>').addClass('chooser-menu').css({ position: 'absolute', height: '95%' })

    # build back button
    if self.currentMenu()
      $btn = $('<a/>').addClass('btn back-btn').html('Back').click () ->
        $topMenu = self.menu.pop()
        $topMenu.css('zIndex',3).hide('slide',{ direction: 'right' }, () -> $topMenu.remove() )
        self.currentMenu().show()
      $menuWrapper.append($btn)

    $ul = $('<ul/>').appendTo($menuWrapper)
    for item in options
      do (item) ->
        $li = $('<li/>').addClass('option').click( (e) ->
          $(this).find('a').triggerHandler('click')
        ).mouseover( (e) -> $(this).addClass('option-hover') )
        .mouseout(  (e) -> $(this).removeClass('option-hover') )
        $li.appendTo($ul)

        $menuItem = $('<a/>').html(item.label)
        $menuItem.appendTo($li)
        if item.options and item.options.length > 0
          $li.addClass('option-category')
          $('<div/>').addClass('next-icon').appendTo( $li )
          $menuItem.data('options',item.options)
          $menuItem.click (e) ->
            e.stopPropagation()
            $prevMenu = self.currentMenu()
            $newMenu = self.renderOptions( $(this).data('options') )
            self.menu.push $newMenu
            $prevMenu.css
              zIndex: -3
            $newMenu.css({ }).hide().appendTo(self.dialog).show 'slide', { direction: 'right' }, () ->
              $prevMenu.hide().css({ zIndex: 0 })
        else if item.value
          $li.addClass('option-item')
          $menuItem.click (e) ->
            self.opts.onChoose.apply(self,[e,item.value]) if self.opts.onChoose
            self.close()
    return $menuWrapper

window.TChooser = TChooser

###
$(document.body).ready ->
  chooser = new TChooser({
    onChoose: (el) ->

    options: [
      {
        label: "Category I"
        options: [
          { label: "Product I", value: 1}
          { label: "Product II", value: 2 }
          { label: "Product III", value: 3 }
          { label: "SubCategory I", options: [
            { label: "Product A.1", value: 7 }
            { label: "Product A.2", value: 8 }
            { label: "Product A.3", value: 9 }
          ]}
        ]
      },
      {
        label: "Category II"
        options: [
          { label: "Product A", value: 1}
          { label: "Product B", value: 2 }
          { label: "Product C", value: 3 }
        ]
      }
    ]
  })
  chooser.open()
  window.chooser = chooser
###
