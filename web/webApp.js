import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, browserHistory, IndexRoute, IndexRedirect} from 'react-router';
import { Jumbotron, Button} from 'react-bootstrap';
import Auth from './webAuth.js'

import Nav from './webNav.js';
import Tab from './webTab.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';
import NotFound from './web404.js';
import Signin from './webSignin.js';
import Setup from './webSetup.js';
import Signout from './webSignout.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'reminders',
      caregiverName: ''
    };
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/user',
      success: function(res) {
        console.log(res);
        this.setState({
          caregiverName: JSON.parse(res).name
        });
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  changeView(select) {
    this.setState({
      view: select
    });
  }

  handleLogin(cb) {
    $.ajax({
      method: 'GET',
      url: '/user',
      success: function(res) {
        if (res) {
          var parsedRes = JSON.parse(res);
          console.log('setting token for', parsedRes);
          if (parsedRes.patientId) {
            localStorage.setItem('userId', parsedRes.id);
          } else {
            localStorage.setItem('setup', 'false');
            localStorage.setItem('userId', parsedRes.id);
          }
          cb()
        }
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  handleLoginRedirect(path) {
    browserHistory.push(path);
  }

  render() {
    return (
      <div className="app-body">
        <Nav name={this.state.caregiverName}/>

        <Tab changeView={this.changeView.bind(this)}/>
        {this.props.children && React.cloneElement(this.props.children, {
          caregiverId: this.state.caregiverId,
          caregiverName: this.state.caregiverName,
          handleLogin: this.handleLogin,
          handleLoginRedirect: this.handleLoginRedirect
        })}
      </div>
    )
  }
}

const requireAuth = function(nextState, replace) {
  if (!Auth.loggedIn()) {
    replace({
      pathname: '/signin',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/signin" component={Signin}/>
      <Route path="/signout" component={Signout}/>
      <Route path="/setup" component={Setup} onEnter={requireAuth}/>
      <Route path="/reminders" component={Reminder} onEnter={requireAuth}/>
      <Route path="/face" component={Face} onEnter={requireAuth}/>
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
  ), document.getElementById('app'));
