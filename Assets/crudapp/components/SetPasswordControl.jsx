var React = require('react');
export default React.createClass({

  propType: {
    "type": React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      // type can be "email" or "manual"
      "type": this.props.type || "email"
    };
  },

  handleTypeChange: function(e) {
    this.setState({
      "type": e.target.value
    });
  },

  render: function() {
    return (
      <div className="form-group">
          <label htmlFor="inputPassword" className="col-lg-2 control-label">新密碼</label>
          <div className="col-lg-10">

              <div className="radio radio-primary" style={ this.props.required ? { "display": "none" } : { } }>
                  <label>
                      <input type="radio" name="set_password" value="none" onClick={this.handleTypeChange} defaultChecked={this.state.type == "none" ? "checked" : ""}/>
                      <span className="circle"></span>
                      <span className="check"></span>
                      <div>保留</div>
                  </label>
              </div>


              <div className="radio radio-primary">
                  <label>
                      <input type="radio" name="set_password" value="email" onClick={this.handleTypeChange} defaultChecked={this.state.type == "email" ? "checked" : ""}/>
                      <span className="circle"></span>
                      <span className="check"></span>
                      <div>新密碼自動產生並用 E-mail 發送給使用者</div>
                  </label>
              </div>
              <div className="radio radio-primary">
                  <label>
                      <input type="radio" name="set_password" value="manual" onClick={this.handleTypeChange}/>
                      <span className="circle"></span>
                      <span className="check"></span>
                      <div>自行更改密碼</div>
                  </label>
              </div>
              <div style={this.state.type != "manual" ? {opacity: 0.3} : {}}>
                  <div className="col-lg-12 clearfix">
                      <label htmlFor="inputPassword" className="control-label pull-left">請輸入新密碼</label>
                      <input id="inputPassword"
                        type="password"
                        disabled={this.state.type == "email" || this.state.type == "none" ? "disabled" : ""}
                        name="password"
                        placeholder="*********"
                        className="form-control"/>
                  </div>
                  <div className="col-lg-12 clearfix">
                      <label htmlFor="inputPasswordConfirm" className="control-label pull-left">再次輸入新密碼</label>
                      <input id="inputPasswordConfirm"
                        type="password"
                        disabled={this.state.type == "email" || this.state.type == "none"  ? "disabled" : ""} 
                        name="password_confirm"
                        placeholder="*********"
                        className="form-control"/>
                  </div>
              </div>
          </div>
      </div>
    );
  }
});
