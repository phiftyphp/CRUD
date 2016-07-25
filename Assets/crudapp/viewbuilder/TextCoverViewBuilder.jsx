import BaseViewBuilder from "../viewbuilder/BaseViewBuilder";
import URIUtils from "../utils/uri";
import CSS from "../utils/css";
import cx from "classnames";


/*
The TextCoverView item description could be very complex like the code below:

The keys are placeholder, you define the mapping record field to fill these
placeholder designed in this view template.

  "itemDesc": {
    "view": "TextCoverView",
    "display": "block",
    "title": { "field": "title" },
    "subtitle": {
      "format": "起跑地點: {start_location}  起跑時間: {start_time}",
    },
    "desc": { "field": "description" },
    "footer": {
      "columns": [
        { "text": { 'format': '費用 {fee}' } },
        { "text": { 'format': '距離 {distance}' } },
      ]
    }
  }
*/
export default class TextCoverViewBuilder extends BaseViewBuilder {

  /**
   * Render tags
   *
   * @param {CRUDHasManyEditor}
   * @param {object}
   * @param {Array|string}
   */
  renderTags(target, record, tags) {
    if (tags instanceof Array) {
      return tags.map((tag, tagIdx) => {
        return <span key={tagIdx} className="tag">{this.renderFieldWithSpec(record, tag)}</span>
      });
    } else if (typeof tags === "string") {
      return <span className="tag">{this.renderFieldWithSpec(record, tag)}</span>
    }
  }

  renderItemHeader(target, record, title, subtitle) {
    return <div key="header" className="item-header">
      <a key="title" onClick={target.handleClickItem.bind(target, record)} className="title">{this.renderFieldWithSpec(record, title)}</a>
      <div key="subtitle" className="subtitle">{this.renderFieldWithSpec(record, subtitle)}</div>
    </div>;
  }

  renderDateLabel(target, record, dateSpec) {
    var datestr = this._findRecordFieldValue(record, dateSpec.field);
    if (!datestr && dateSpec.show_empty) {
      datestr = "----/--/-- --:--";
    }
    if (datestr) {
      return <div key="date-label" className="date-label">
        On <span className="date">{datestr}</span>
      </div>;
    }
    return null;
  }

  /**
   * Render footer component
   *
   * @param {CRUDHasManyEditor}
   * @param {object}
   * @param {object} footerSpec
   * @param {Array} controls
   */
  renderItemFooter(target, record, footerSpec, controls) {
    var columns = [];
    if (typeof footerSpec.columns !== "undefined"
        && footerSpec.columns instanceof Array)
    {
      footerSpec.columns.forEach((col, i) => {
        if (col.text) {
          columns.push(
            <div className="column" key={i}>
              {this.renderFieldWithSpec(record, col.text)}
            </div>
          );
        } else if (col.tags) {
          columns.push(<div className="column" key={i}>
            {this.renderTags(target, record, col.tags)}
          </div>);
        }
      });
    }

    if (controls && controls instanceof Array) {
      columns.push(<div key="controls" className="pull-right controls">
        {this.renderItemControls(target, record, controls)}
      </div>);
    }

    return <div key="footer" className="item-footer clearfix">
      {columns}
    </div>;
  }

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

  /**
   * @param {CRUDHasManyEditor} record
   * @param {object} record
   * @param {key} string
   */
  renderRecord(target, record, key) {
    var _tmp;
    var childViews = [];

    if (target.props.delete) {
      var btn = this.renderRemoveIconButton(target, record);
      childViews.push(btn);
    }

    if (this.itemDesc.date) {
      if (_tmp = renderDateLabel(target, record, this.itemDesc.date)) {
        childViews.push(label);
      }
    }

    if (this.itemDesc.title || this.itemDesc.subtitle) {
      childViews.push(this.renderItemHeader(target, record, this.itemDesc.title, this.itemDesc.subtitle));
    }

    if (this.itemDesc.desc) {
      childViews.push(<div key="desc" className="item-desc">{this.renderFieldWithSpec(record, this.itemDesc.desc)}</div>);
    }

    if (this.itemDesc.footer) {
      if (_tmp = this.renderItemFooter(target, record, this.itemDesc.footer, this.itemDesc.controls)) {
        childViews.push(_tmp);
      }
    }

    if (target.props.references && target.props.schema) {
      if (_tmp = this._renderItemSignatureInputs(target, record)) {
        childViews.push(_tmp);
      }
    }

    var classes = cx({
      "crud-record-item": true,
      "is": true,
      "text-cover": true,
      "float": this.itemDesc.display === 'float',
      "block": this.itemDesc.display === "block",
      "inline-block": this.itemDesc.display === "inline-block"
    });
    return <div className={classes} key={key}>{childViews}</div>;
  }
}

