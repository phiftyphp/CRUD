// Generated by CoffeeScript 1.9.3
(function() {
  var CRUDDialog;

  CRUDDialog = (function() {
    function CRUDDialog(path, args, opts) {
      if ($('.ui-dialog').get(0)) {
        $('.ui-dialog').remove();
      }
      $.get(path, args, function(html) {
        var $el, dialogOptions;
        $el = $(html);
        Phifty.CRUD.initEditRegion($el, {
          setupAction: function(a) {
            return a.plug(ActionMsgbox, {
              disableScroll: true,
              container: $el.find('.action-result-container').first()
            });
          },
          actionOptions: {
            beforeSubmit: opts.beforeSubmit,
            onSuccess: function(resp) {
              if (opts.onSuccess) {
                opts.onSuccess(resp, $el);
              }
              return setTimeout((function() {
                $el.dialog('close');
                return $el.remove();
              }), 1000);
            }
          }
        });
        dialogOptions = $.extend({
          minWidth: 800,
          modal: true
        }, opts.dialogOptions);
        $el.dialog(dialogOptions);
        use_tinymce('adv1', {
          popup: true
        });
        if (opts.init) {
          return opts.init($el);
        }
      });
    }

    return CRUDDialog;

  })();

  window.CRUDDialog = CRUDDialog;

}).call(this);
