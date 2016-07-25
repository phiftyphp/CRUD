

/**
 * BaseViewBuilder generates record view dynamically from pre-defined item
 * description.
 */
export default class BaseViewBuilder {
  /**
   * @param {object} itemDesc
   */
  constructor(itemDesc) {
    this.itemDesc = itemDesc;
  }


  /**
   * Render header for items (each page)
   */
  renderHeader() { }

  /**
   * Render footer for items (each page)
   */
  renderFooter() { }

  /**
   * Render record with itemDesc's spec
   *
   * @param {object} record
   * @param {object} config
   * @return {string}
   */
  renderFieldWithSpec(record, config) {
    if (config.field) {
      return this._findRecordFieldValue(record, config.field) || config.defaultValue;
    } else if (config.format) {
      return this._renderFormat(record, config.format);
    }
    return '';
  }


  /**
   * Render record field value with format string
   *
   * @param {object} record
   * @param {string} format
   * @return {string}
   */
  _renderFormat(record, format) {
    return format.replace(/{(\w+)}/g, (all, capturedField) => {
      return this._findRecordFieldValue(record, capturedField);
    });
  }

  /**
   * Return the field value by checking each field name.
   *
   * @param {object} record
   * @param {Array|string} fields
   * @return {mixed}
   */
  _findRecordFieldValue(record, fields) {
    if (typeof fields === "string") {
      return record[fields];
    } else if (fields instanceof Array) {
      for (var i = 0 ; i < fields.length; i++) {
        var field = fields[i];
        if (record[field]) {
          return record[field];
        }
      }
    } else {
      console.error('fields',fields,' is not defined in record', record);
    }
  }



  /**
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   */
  renderEditButton(target, record) {
    return <button key="btn-edit" className="btn btn-primary btn-sm" 
      onClick={target.handleEditItem.bind(target, record)}>
        編輯
      </button>;
  }

  /**
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   */
  renderDeleteButton(target, record) {
    return <button key="btn-delete" className="btn btn-primary btn-sm" 
      onClick={target.handleDeleteItem.bind(target, record)}>
        刪除
      </button>
      ;
  }

  /**
   * Render controls in btn-group
   *
   * There are 2 built-in actions right now:
   *
   * 'edit' edit the record
   * 'delete' delete the record
   *
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   * @param {Array} controls itemDesc.controls spec
   */
  renderItemControls(target, record, controls) {
    return <div className="btn-group">
      {controls.map((control, i) => {
        switch (control.action || control.feature) {
          case "edit":
            return this.renderEditButton(target, record);
          case "delete":
            return this.renderDeleteButton(target, record);
        }
      })}
    </div>;
  }

  /**
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   */
  renderRemoveIconButton(target, record) {
    var itemDesc = this.itemDesc;
    return <div key="removeBtn" className="remove-btn" onClick={target.handleDeleteItem.bind(target, record)}>
        <i className="fa fa-times-circle"> </i>
      </div>;
  }

  /**
   * _buildItemSignatureInputs builds the hidden input fields for 
   * the inserted new record. (only one record for each call)
   *
   * ActionKit will handle the record signature.
   *
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   */
  _renderItemSignatureInputs(target, record) {
    var itemDesc = this.itemDesc;
    var inputs = [];
    var schema = target.props.schema;
    var references = target.props.references;
    var pk = schema.primaryKey;

    if (!pk) {
      return console.error("itemDesc.primaryKey is not defined.");
    }

    var signatureId = record[pk];

    // build the reset reference field
    if (references) {
      for (var foreignKey in references) {
        var referenceInfo = references[foreignKey];
        var inputValue = referenceInfo.record[referenceInfo.key];
        var inputName = "{relationship}[{signature}][{foreignKey}]".replace('{relationship}', referenceInfo.referedRelationship)
          .replace('{signature}', signatureId)
          .replace('{foreignKey}', foreignKey)
          ;
        inputs.push(<input key={foreignKey} type="hidden" name={inputName} defaultValue={inputValue}/>);

        // build the primary key field for the item
        var inputName = "{relationship}[{signature}][{foreignKey}]".replace('{relationship}', referenceInfo.referedRelationship)
          .replace('{signature}', signatureId)
          .replace('{foreignKey}', pk)
          ;
        inputs.push(<input key={pk} type="hidden" name={inputName} defaultValue={signatureId}/>);
      }
    }
    return inputs;
  }


  /**
   * This method could be overridded to render a wrapper around the records.
   *
   * @param {CRUDHasManyEditor} target
   * @param {Array<object>} records
   */
  renderRecords(target, records) {
    return records.map(this.renderRecord.bind(this, target));
  }

  /**
   * This method could be overridded to render a wrapper around the records.
   *
   * @param {CRUDHasManyEditor} target
   * @param {Array<object>} records
   */
  render(target, records) {
    var addView = this.itemDesc.add !== false ? this.renderAddView(target) : null;
    return <div className="crud-record-item-container clearfix">
      {this.renderHeader()}
      {this.renderRecords(target, records)}
      {this.renderFooter()}
      {addView}
    </div>;
  }
}
