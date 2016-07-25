import TableViewBuilder from "../viewbuilder/TableViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";

export default class MemberRewardTableViewBuilder extends TableViewBuilder {

  constructor(itemDesc) {
    super(itemDesc);
  }

  // We have 'records' here for summary
  renderFooter(target, records) {
    var footerRows = [];
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
