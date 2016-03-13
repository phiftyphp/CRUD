
var BootstrapFormHighlight = function(form) {
  this.form = form;
};
BootstrapFormHighlight.prototype.fromValidations = function(validations) {
  for (var field in validations) {
    var validation = validations[field];
    if (validation.valid == false) {
      this.addError(field, validation.message || validation.desc);
    } else {
      this.addSuccess(field, validation.message || validation.desc);
    }
  }
};
BootstrapFormHighlight.prototype.addError = function(field, message) {
  if (this.form[field]) {
    var $fieldInput = $(this.form[field]);
    var $formGroup = $($fieldInput.parents('.form-group').get(0));
    $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-remove form-control-feedback'));
    $fieldInput.after($('<span class="sr-only"/>').text('error'));
    if (message) {
      $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
    }
    $formGroup.addClass('has-error');
  }
};
BootstrapFormHighlight.prototype.addWarning = function(field, message) {
  if (this.form[field]) {
    var $fieldInput = $(this.form[field]);
    var $formGroup = $($fieldInput.parents('.form-group').get(0));
    $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-sign form-control-feedback'));
    $fieldInput.after($('<span class="sr-only"/>').text('warning'));
    if (message) {
      $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
    }
    $formGroup.addClass('has-warning');
  }
};
BootstrapFormHighlight.prototype.addSuccess = function(field, message) {
  if (this.form[field]) {
    var $fieldInput = $(this.form[field]);
    var $formGroup = $($fieldInput.parents('.form-group').get(0));
    $fieldInput.after($('<span aria-hidden="true"/>').addClass('glyphicon glyphicon-warning-ok form-control-feedback'));
    $fieldInput.after($('<span class="sr-only"/>').text('success'));
    if (message) {
      $fieldInput.after($('<span/>').addClass('help-block help-block-validation').text(message));
    }
    $formGroup.addClass('has-success');
  }
};
BootstrapFormHighlight.prototype.cleanup = function(field, message) {
  for (var field in this.form) {
    var el = this.form[field];
    if (el instanceof Node && el.nodeName == "INPUT") {
      var $formGroup = $($(el).parents('.form-group').get(0));
      $formGroup.removeClass('has-error has-success has-warning');
      $formGroup.find('.glyphicon').remove();
      $formGroup.find('.sr-only').remove();
      $formGroup.find('.help-block-validation').remove();
    }
  }
};
BootstrapFormHighlight.prototype.getFirstInvalidField = function() {
  return $(this.form).find('.has-error, .has-warning').get(0);
};

module.exports = BootstrapFormHighlight;
