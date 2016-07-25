import BaseViewBuilder from "../viewbuilder/BaseViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";

export default class ProductItemViewBuilder extends BaseViewBuilder {

  defaultWidth: 160
  defaultHeight: 150

  /**
   * This is mostly the same of the image cover view builder, we didnt' change it 
   * However this method was kept for more customization.
   *
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

  handleAddItem(target, record, e) {
    e.preventDefault();
    var qty = e.target.parentNode.querySelector('select.quantity').value;
    var t = e.target.parentNode.querySelector('select.product-type');
    target.handleChooseItem.call(target, record, qty, t ? t.value : null, e);
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
    childViews.push(<div key="price" className="price">$ {record.price}</div>);

    if (record.types && record.types.length > 0) {
      var options = record.types.map((productType, i) => {
        return <option key={i} value={productType.id}>{productType.name}</option>;
      });
      var first = record.types.slice(0,1);
      var defaultValue = first.length ? first[0].id : 0;
      childViews.push(<div key="product-type" className="product-type form-inline pull-left">
                        類型
                        <select className="product-type form-control" defaultValue={defaultValue}>
                          {options}
                        </select>
                      </div>);
    }

    // Generate quantity chooser
    if (record.quantity) {
      var options = [];
      for (var i = 1; i < record.quantity ; i++) {
        options.push(<option key={i} value={i}>{i}</option>);
      }
      childViews.push(<div key="quantity" className="quantity form-inline pull-left">
                        <select className="quantity form-control" defaultValue={1}>
                          {options}
                        </select>
                      </div>);
      childViews.push(<button key="add-item-btn" className="btn btn-blue" onClick={this.handleAddItem.bind(this, target, record)}>Add</button>);
    } else {
      childViews.push(<button key="add-item-btn" className="btn btn-disabled">已售完</button>);
    }


    var classes = cx({
      "additional-product": true,
      "crud-record-item": true,
      "crud-record-item-cover": true,
      "float": true,
      "inline-block": this.itemDesc.display === "inline-block"
    });
    return <div className={classes} key={key}>{childViews}</div>;
  }
}

