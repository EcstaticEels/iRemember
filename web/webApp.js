import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, browserHistory, IndexRoute} from 'react-router';
import { Jumbotron, Button} from 'react-bootstrap';


import Nav from './webNav.js';
import Tab from './webTab.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';
import NotFound from './web404.js'

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


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/reminders" component={Reminder}/>
      <Route path="/face" component={Face}/>
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
  ), document.getElementById('app'));
