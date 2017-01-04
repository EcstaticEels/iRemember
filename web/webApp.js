import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, browserHistory, IndexRoute} from 'react-router';

import Nav from './webNav.js';
import Tab from './webTab.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 1,
      name: 'Bob',
      view: 'reminders'
    };
  }

  changeView(select) {
    this.setState({
      view: select
    })
  }

  render() {
    return (
      <div className="app-body">
        <Nav/>
        <Tab changeView={this.changeView.bind(this)}/>
        {this.props.children && React.cloneElement(this.props.children, {
          id: this.state.id,
          name: this.state.name
        })}
      </div>
    )
  }
}

// <Reminder id={this.state.id} name={this.state.name}/>


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Reminder}/>
      <Route path="/reminders" component={Reminder}/>
      <Route path="/face" component={Face}/>
    </Route>
  </Router>
  ), document.getElementById('app'));
