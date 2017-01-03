import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, Link, browserHistory, IndexRoute} from 'react-router';

import webNav from './webNav.js';
import webFace from './webFace.js';
import webReminder from './webReminder.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app-body">
        <h1>Hi</h1>
        <webNav/>
        {/*Another nav (tabs)*/}
      </div>
    )
  }
}


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
      <Route path="/reminders" component={webReminder}/>
      <Route path="/face" component={webFace}/>
  </Router>
  ), document.getElementById('app'));
