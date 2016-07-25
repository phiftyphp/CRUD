import TableViewBuilder from "../viewbuilder/TableViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";

export default class EventRegGroupTableViewBuilder extends TableViewBuilder {

  constructor(itemDesc) {
    super(itemDesc);
  }

  // We have 'records' here for summary
  renderFooter(target, records) {
    var footerRows = [];

    // Calculate price summary
    var totalAmount = records.reduce(function(carry, current) {
      return carry + parseInt(current.total_amount) || 0;
    }, 0);

    footerRows.push(<tr key={"total-amount"}>
      <td style={{textAlign: "right"}} colSpan={this.itemDesc.columns.length-1}>總計</td>
      <td>{totalAmount}</td>
      <td></td>
    </tr>);

    var addView = this.itemDesc.add !== false ? this.renderAddView(target) : null;
    if (addView) {
      footerRows.push(<tr key={"add"}>
        <td colSpan={this.itemDesc.columns.length + 1}>{addView}</td>
      </tr>);
    }
    return <tfoot>{footerRows}</tfoot>;
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
      {this.renderFooter(target, records)}
    </table>;
  }
}
