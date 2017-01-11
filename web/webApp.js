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


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caregiverId: '',
      caregiverName: '',
      view: 'reminders'
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  changeView(select) {
    this.setState({
      view: select
    });
  }

  handleLogin() {
    console.log(document.cookie)
    // if (document.cookie) {
    //   const cookies = document.cookie.split(';');
    //   const username = unescape(cookies[0].slice(cookies[0].indexOf('=') + 1));
    //   const userId = cookies[1].slice(cookies[1].indexOf('=') + 1);
    //   this.setState({
    //     caregiverId: userId,
    //     caregiverName: username
    //   });
    // }
  }

  render() {
    return (
      <div className="app-body">
        <Nav />

        <Tab changeView={this.changeView.bind(this)}/>
        {this.props.children && React.cloneElement(this.props.children, {
          caregiverId: this.state.caregiverId,
          caregiverName: this.state.caregiverName,
          handleLogin: this.handleLogin
        })}
      </div>
    )
  }
}

const requireAuth = function(nextState, replace) {
  console.log(document.cookie.split(';'))
  // if (!Auth.loggedIn()) {
  //   console.log('you are not logged in')
  //   replace({
  //     pathname: '/signin',
  //     state: { nextPathname: nextState.location.pathname }
  //   });
  // }
};


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/signin" component={Signin}/>
      <Route path="/setup" component={Setup} onEnter={requireAuth}/>
      <Route path="/reminders" component={Reminder} onEnter={requireAuth}/>
      <Route path="/face" component={Face} onEnter={requireAuth}/>
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
  ), document.getElementById('app'));
