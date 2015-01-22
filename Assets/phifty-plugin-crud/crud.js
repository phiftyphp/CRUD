// Generated by CoffeeScript 1.7.1

/*
vim:sw=2:ts=2:sts=2:
 */

(function() {
  if (!window.Phifty) {
    window.Phifty = {};
  }

  Phifty.CRUD = {
    closeEditRegion: function(el) {
      var r;
      r = Region.of(el);
      if ($.scrollTo) {
        return $.scrollTo(r.getEl().parent(), 100, function() {
          return r.remove();
        });
      } else {
        return r.remove();
      }
    },
    initEditRegion: function($el, opts) {
      var actionOptions;
      $(document.body).trigger('phifty.region_load');
      opts = $.extend({
        removeRegion: true
      }, opts);
      if (opts.defaultTinyMCE) {
        use_tinymce('adv1');
      }
      actionOptions = $.extend({
        clear: false,
        onSuccess: function(resp) {
          var r, self;
          self = this;
          if (opts.removeRegion) {
            r = Region.of(self.form());
            if (r) {
              if (r.triggerElement) {
                Region.of(r.triggerElement).refresh();
              }
              return r.remove();
            }
          }
        }
      }, opts.actionOptions || {});
      return $el.find('.ajax-action').each(function(i, f) {
        var a;
        a = Action.form(f, actionOptions);
        if (opts.setupAction) {
          return opts.setupAction(a);
        }
      });
    }
  };

}).call(this);
