
import CRUDListKeywordFilterControl from './CRUDListKeywordFilterControl';
import CRUDListApp from './CRUDListApp';
import React from "react";

export default React.createClass({
  mixins: [CRUDListApp],
  getInitialState: function() {
    return {};
  },
  renderFilterSection: function() {
    return (
      <div className="well multiple-filter-container">
        <div className="form-inline">
          <div className="form-group">
            <label>篩選條件</label>
          </div>
          <CRUDListKeywordFilterControl context={this.state.context} placeholder="請輸入關鍵字"/>
        </div>
      </div>
    );
  }
});
