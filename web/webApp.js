import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, Link, browserHistory, IndexRoute} from 'react-router';

import Nav from './webNav.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app-body">
        <h1>Hi</h1>
        <Nav/>
        <Reminder/>
        {/*Another nav (tabs)*/}
      </div>
    )
  }
}


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
      {/* might need indexroute */}
      <Route path="/reminders" component={Reminder}/>
      <Route path="/face" component={Face}/>
  </Router>
  ), document.getElementById('app'));
