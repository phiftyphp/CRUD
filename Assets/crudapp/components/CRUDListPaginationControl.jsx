
var React = require('react');

export default React.createClass({
  getInitialState: function() {
    return {
      "numberOfPages": 1,
      "currentPage": 1
    };
  },

  handlePaging: function(page, e) {
    e.stopPropagation();
    this.props.context.actionCreators.applyFilter("page", page);
  },

  render: function() {
    var pages = this.state.numberOfPages;
    var currentPage = this.state.currentPage;
    var pageLinks = [ ];
    if (currentPage > 1) {
      pageLinks.push(
        <li key="prev-page">
          <a className="pager-prev" onClick={this.handlePaging.bind(this, currentPage - 1)}>上一頁</a>
        </li>
      );
    } else {
      pageLinks.push(
        <li key="prev-page" className="disabled">
          <a className="pager-prev">上一頁</a>
        </li>
      );
    }

    for (var p = Math.max(1, currentPage - 5) ; p <= Math.min(currentPage + 5, pages) ; p++) {
      pageLinks.push(
        <li key={p} className={currentPage == p ? "active" : ""}>
          <a className="pager-number" onClick={this.handlePaging.bind(this,p)}>{p}</a>
        </li>
      );
    }

    if (pages > 1 && currentPage < pages ) {
      pageLinks.push(
        <li key="next-page">
          <a className="pager-prev"  onClick={this.handlePaging.bind(this, currentPage + 1)}>下一頁</a>
        </li> 
      );
    } else {
      pageLinks.push(
        <li key="next-page" className="disabled">
          <a className="pager-prev">下一頁</a>
        </li> 
      );
    }

    return (
      <div className="form-group">
        <ul className="pagination pagination-sm">
          {pageLinks}
        </ul>
      </div>
    );
  }
});
