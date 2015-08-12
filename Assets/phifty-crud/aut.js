// Generated by CoffeeScript 1.9.3
(function() {
  var AutoCompleteTaggingWidget;

  AutoCompleteTaggingWidget = (function() {
    function AutoCompleteTaggingWidget(el, config) {
      var dataconfig;
      if (typeof el === "string") {
        this.input = $(document.getElementById(id));
      } else {
        this.input = $(el);
      }
      dataconfig = this.extractDataConfig();
      this.config = $.merge(dataconfig, config);
    }

    AutoCompleteTaggingWidget.prototype.extractDataConfig = function() {
      var dataconfig, recordsJson;
      dataconfig = {
        deleteAction: this.input.data("delete-action"),
        relation: this.input.data("relation"),
        container: this.input.data("container"),
        foreignKey: this.input.data("foreign-key"),
        foreignCreateAction: this.input.data("foreign-create-action"),
        foreignRecordPrimaryField: this.input.data("foreign-record-primary-field"),
        foreignRecordPrimaryKey: this.input.data("foreign-record-primary-key"),
        autocomplete: {
          delay: this.input.data("autocomplete-delay") || 100,
          minLength: this.input.data("autocomplete-min-length") || 1,
          source: this.input.data("autocomplete-source")
        }
      };
      recordsJson = this.decodeEntities(this.input.data("records"));
      if (recordsJson && recordsJson.length > 2) {
        dataconfig.records = JSON.parse(recordsJson);
      }
      return dataconfig;
    };

    AutoCompleteTaggingWidget.prototype.decodeEntities = function(str) {
      var d;
      d = document.createElement("div");
      d.innerHTML = str;
      if (typeof d.innerText !== "undefined") {
        return d.innerText;
      } else {
        return d.textContent;
      }
    };

    AutoCompleteTaggingWidget.prototype.renderExistingRecords = function() {
      var j, len, record, ref, results;
      if (this.config.records && this.config.records.length > 0) {
        ref = this.config.records;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          record = ref[j];
          results.push((function(_this) {
            return function(record) {
              var $item, item;
              item = new CRUDList.NewTextItemView({
                id: record.value
              }, {
                label: record.label
              }, {
                index: record.value,
                deleteAction: _this.config.deleteAction,
                relation: _this.config.relation,
                onRemove: function(e) {}
              });
              $item = item.render();
              return $item.appendTo(_this.getContainer());
            };
          })(this)(record));
        }
        return results;
      }
    };

    AutoCompleteTaggingWidget.prototype.getContainer = function() {
      return $(this.config.container);
    };

    AutoCompleteTaggingWidget.prototype.addTag = function(label, foreignId) {
      var $item, args, item, self;
      self = this;
      args = {};
      args[self.config.foreignKey] = foreignId;
      item = new CRUDList.NewTextItemView(args, {
        label: label
      }, {
        relation: self.config.relation,
        index: "new-" + foreignId,
        onRemove: function(e) {}
      });
      $item = item.render();
      return $item.appendTo($(self.config.container));
    };

    AutoCompleteTaggingWidget.prototype.init = function() {
      var $create, self;
      self = this;
      this.renderExistingRecords();
      $create = this.input.next(".control-create");
      if ($create.get(0) && this.config.foreignCreateAction && this.config.foreignRecordPrimaryField) {
        $create.click((function(_this) {
          return function(e) {
            var args;
            args = {};
            args[_this.config.foreignRecordPrimaryField] = _this.input.val();
            _this.input.prop('disabled', 'disabled');
            return runAction(_this.config.foreignCreateAction, args, function(resp) {
              _this.addTag(resp.data[_this.config.foreignRecordPrimaryField], resp.data[_this.config.foreignRecordPrimaryKey]);
              _this.input.val("");
              _this.input.removeProp('disabled');
              return _this.input.focus();
            });
          };
        })(this));
      }
      return this.input.autocomplete({
        delay: this.config.autocomplete.delay,
        minLength: this.config.autocomplete.minLength,
        source: this.config.autocomplete.source,
        select: function(e, ui) {
          var $item, args, item;
          args = {};
          args[self.config.foreignKey] = ui.item.id || ui.item.value;
          item = new CRUDList.NewTextItemView(args, {
            label: ui.item.label
          }, {
            relation: self.config.relation,
            index: "new-" + ui.item.id || ui.item.value,
            onRemove: function(e) {}
          });
          $item = item.render();
          $item.appendTo($(self.config.container));
          self.input.val("");
          self.input.focus();
          return false;
        },
        focus: function(e, ui) {
          return self.input.trigger("focus");
        }
      });
    };

    return AutoCompleteTaggingWidget;

  })();

  window.AutoCompleteTaggingWidget = AutoCompleteTaggingWidget;

  $(function() {
    var findAndInit;
    findAndInit = function(container) {
      return $(container).find('[data-widget="aut"]').each(function(i, el) {
        var aut;
        aut = new AutoCompleteTaggingWidget(el, {});
        return aut.init();
      });
    };
    $(Region).bind('region.load', function(e, reg) {
      return findAndInit(reg);
    });
    return findAndInit($(document.body));
  });

}).call(this);
