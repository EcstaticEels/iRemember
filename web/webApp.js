import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, Link, browserHistory, IndexRoute} from 'react-router';

import Nav from './webNav.js';
// import Face from './webFace.js';
import Reminder from './webReminder.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      name: 'Bob'
    };
  }
  render() {
    return (
      <div className="app-body">
        <Nav/>
        <Reminder id={this.state.id} name={this.state.name}/>
      </div>
    )
  }
}

// <Reminder id={this.state.id} name={this.state.name}/>


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}/>
      {/* might need indexroute */}
      <Route path="/reminders" component={Reminder}/>
      
  </Router>
  ), document.getElementById('app'));

// <Route path="/face" component={Face}/>
