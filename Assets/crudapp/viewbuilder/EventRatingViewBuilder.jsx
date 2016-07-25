import BaseViewBuilder from "../viewbuilder/BaseViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";

/*
 * User app event rating view builder
 */
export default class EventRatingViewBuilder extends BaseViewBuilder {

  /**
   * @param {CRUDHasManyEditor} target
   */
  renderAddView(target) {
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
      "block": true
    });
    return <div className={classes} key={"add"} onClick={target.handleAddItem}>
      <div style={boxStyle}>
        <i className="fa fa-plus"> </i>
      </div>
    </div>;
  }


  /**
   *
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   * @param {key} string
   */
  renderRecord(target, record, key) {
    var childViews = [];
    var classes = cx({
      "crud-record-item": true,
      "is": true,
      "text-cover": true,
      "block": true
    });


    childViews.push(
      <ul key="ratings" className="nav nav-pills">
        <li><a>費用 <span className="badge">{record.fee_rating}</span></a></li>
        <li><a>紀念品 <span className="badge">{record.souvenir_rating}</span></a></li>
        <li><a>難度 <span className="badge">{record.difficulty_rating}</span></a></li>
        <li><a>場地 <span className="badge">{record.place_rating}</span></a></li>
      </ul>
    );

    if (record.comment) {
      childViews.push(<div className="desc" key="comment">
                        <div>評論</div>
                        <div>{record.comment}</div>
                      </div>);
    }

    if (this.itemDesc.controls && this.itemDesc.controls instanceof Array) {
      childViews.push(<div key="controls" className="pull-right controls">
        {this.renderItemControls(target, record, this.itemDesc.controls)}
      </div>);
    }

    if (target.props.references && target.props.schema) {
      var inputs = this._renderItemSignatureInputs(target, record);
      childViews.push(inputs);
    }
    return <div className={classes} key={key}>{childViews}</div>;
  }

}
