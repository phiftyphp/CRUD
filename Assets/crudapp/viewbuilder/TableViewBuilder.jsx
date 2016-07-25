import BaseViewBuilder from "../viewbuilder/BaseViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";

export default class TableViewBuilder extends BaseViewBuilder {

  /**
   * @param {CRUDHasManyEditor} target
   */
  renderAddView(target) {
    var itemDesc = this.itemDesc;
    var boxStyle = {
      'height': '50px',
      'lineHeight': '50px',
      'textAlign': 'center'
    };
    var classes = cx({
      "crud-record-item": true,
      "add": true,
      "is": true,
      "text-cover": true,
      "float": itemDesc.display === 'float',
      "block": itemDesc.display === "block",
      "inline-block": itemDesc.display === "inline-block"
    });
    return <div className={classes} key={"add"} onClick={target.handleAddItem}>
      <div style={boxStyle}>
        <i className="fa fa-plus"> </i>
      </div>
    </div>;
  }

  renderHeader(target) {
    var headers = [];
    return <thead>
      <tr>
        {this.itemDesc.columns.map(function(el,i) {
          return <th key={i}>{el.label}</th>;
        })}
        <th key="controls">{"-"}</th>
      </tr>
    </thead>;
  }

  renderRecords(target, records) {
    return <tbody>
      {super.renderRecords(target, records)}
    </tbody>;
  }

  renderFooter(target) {
    var addView = this.itemDesc.add !== false ? this.renderAddView(target) : null;
    if (!addView) {
      return null;
    }
    return <tfoot>
      <tr>
        <td colSpan={this.itemDesc.columns.length + 1}>{addView}</td>
      </tr>
    </tfoot>;
  }

  /**
   * @param {CRUDHasManyEditor} record
   * @param {object} record
   * @param {key} string
   */
  renderRecord(target, record, key) {

    var formFields;
    if (target.props.references && target.props.schema) {
      formFields = this._renderItemSignatureInputs(target, record);
    }

    return <tr key={key}>
      {this.itemDesc.columns.map(function(col, i) {
        var keys = col.key.split(/\./);
        var k;
        var v = record;
        while (k = keys.pop()) {
          v = v[k];
        }
        // Render form fields
        return <td key={i}>
          <span style={col.style}>{v}</span>
        </td>;
      })}
      <td key="controls">
        {this.renderItemControls(target,record, this.itemDesc.controls || [])}
        {formFields}
      </td>
    </tr>;
  }


  /**
   * This method could be overridded to render a wrapper around the records.
   *
   * @param {CRUDHasManyEditor} target
   * @param {Array<object>} records
   */
  render(target, records) {
    return <table className="table table-strip">
      {this.renderHeader(target)}
      {this.renderRecords(target, records)}
      {this.renderFooter(target)}
    </table>;
  }
}
