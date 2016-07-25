import BaseViewBuilder from "../viewbuilder/BaseViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";

export default class ImageCoverViewBuilder extends BaseViewBuilder {

  defaultWidth: 160
  defaultHeight: 150

  /**
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   */
  _renderImageView(target, record) {
    var itemDesc = this.itemDesc;
    var imageUrl = this._findRecordFieldValue(record, itemDesc.coverImage.field);
    var style = {
      // FIXME: remove this leading slash
      'backgroundImage': CSS.url("/" + imageUrl),
      'backgroundSize': itemDesc.coverImage.backgroundSize || 'cover',
      'backgroundPosition': 'center center',
      'backgroundRepeat': 'no-repeat',
      'width': (itemDesc.coverImage.width || this.defaultWidth) + 'px',
      'height': (itemDesc.coverImage.height || this.defaultHeight) + 'px'
    };
    return <div key="coverImage"
      onClick={target.handleClickItem.bind(target, record)}
      style={style}> </div>;
  }

  /**
   * @param {CRUDHasManyEditor} target
   */
  renderAddView(target) {
    var itemDesc = this.itemDesc;
    var boxStyle = {
      'width': (itemDesc.coverImage.width || this.defaultWidth) + 'px',
      'height': (itemDesc.coverImage.height || this.defaultHeight ) + 'px',
      'lineHeight': (itemDesc.coverImage.height || this.defaultHeight) + 'px',
      'textAlign': 'center'
    };
    var classes = cx({
      "crud-record-item": true,
      "add": true,
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

  /**
   * @param {CRUDHasManyEditor} target
   * @param {object} record
   * @param {string} string
   */
  renderRecord(target, record, key) {
    var childViews = [];

    if (this.itemDesc.coverImage) {
      var image = this._renderImageView(target, record);
      childViews.push(image);
    }

    if (this.itemDesc.title) {
      var title = this._findRecordFieldValue(record, this.itemDesc.title.field) || "Untitled";
      // itemDesc.title
      childViews.push(<div key="title" className="title">{title}</div>);
    }

    if (target.props.delete) {
      var btn = this.renderRemoveIconButton(target, record);
      childViews.push(btn);
    }

    if (target.props.references && target.props.schema) {
      var inputs = this._renderItemSignatureInputs(target, record);
      childViews.push(inputs);
    }

    if (this.itemDesc.controls) {
      childViews.push(<div key="controls" className="pull-right controls">
        {this.renderItemControls(target, record, this.itemDesc.controls)}
      </div>);
    }

    var classes = cx({
      "crud-record-item": true,
      "crud-record-item-cover": true,
      "float": this.itemDesc.display === 'float',
      "block": this.itemDesc.display === "block",
      "inline-block": this.itemDesc.display === "inline-block"
    });
    return <div className={classes} key={key}>{childViews}</div>;
  }
}

