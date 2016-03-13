
export default class BulkManager {
  constructor($table) {
    this.table = $table;
  }

  init() {


  }

  findCheckboxByValue(val) {
    return this.table.find('input.crud-bulk-select[value="' + val + '"]');
  }

  findCheckboxes() {
    return this.table.find('input.crud-bulk-select');
  }

  findSelectedCheckboxes() {
    return this.table.find('input.crud-bulk-select:checked');
  }

  findSelectedItemValues() {
    return this.findSelectedCheckboxes().map(function(i, e) {
      return parseInt(e.value);
    }).get();
  }

  findSelectAllCheckbox() {
    return this.table.find('input.crud-bulk-select-all');
  }

  deselectAll(e) {
    if (!e) {
      this.findSelectAllCheckbox().prop('checked', false);
    }
    this.findCheckboxes().prop('checked', false);
    this.table.find('tbody tr').removeClass('selected active');
  }

  selectAll(e) {
    if (!e) {
      this.findSelectAllCheckbox().prop('checked', true);
    }
    this.findCheckboxes().prop('checked', true);
    this.table.find('tbody tr').addClass('selected active');
  }

  /**
   * @return boolean true when all is selected, false when all is deselected.
   */
  toggleSelectAll(e) {
    if (this.findSelectAllCheckbox().is(":checked")) {
      this.selectAll(e);
      return true;
    } else {
      this.deselectAll(e);
      return false;
    }
  }
}
