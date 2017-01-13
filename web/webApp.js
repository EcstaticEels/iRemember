import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, browserHistory, IndexRoute, IndexRedirect} from 'react-router';
import { Jumbotron, Button} from 'react-bootstrap';
import { observer } from 'mobx-react';
import WebMobxStore from './webMobxStore';

import Nav from './webNav.js';
import Tab from './webTab.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';
import NotFound from './web404.js';
import Signin from './webSignin.js';
import Setup from './webSetup.js';
import Signout from './webSignout.js';

var {caregiverName} = WebMobxStore;
var {needsSetup} = WebMobxStore;

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'reminders',
      caregiverName: ''
    };
  }

  componentDidMount() {
    //ajax function that sets the user--> protects the front end
    $.ajax({
      method: 'GET',
      url: '/user',
      success: function(res) {
        if (res) {
          var parsed = JSON.parse(res);
          WebMobxStore.update("caregiverName", parsed.name);
          if (!parsed.patientId) {
            WebMobxStore.update("needsSetup", true);
          }
          this.setState({
            caregiverName: parsed.name
          }, () => {
            console.log('state after app mount get user', this.state)
          })
        } else {
          console.log('app mount you are not signed in', caregiverName, needsSetup)
        }
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

  handleLogout() {
    WebMobxStore.update("caregiverName", '');
    WebMobxStore.update("needsSetup", false);
    this.setState({
      caregiverName: ''
    }, () => {
      console.log('state after logout', this.state)
    })
  }


  handleRedirect(path) {
    browserHistory.push(path);
  }

  render() {
    return (
      <div className="app-body">
        <Nav caregiverName={this.state.caregiverName}/>

        <Tab changeView={this.changeView.bind(this)}/>
        {this.props.children && React.cloneElement(this.props.children, {
          // caregiverId: this.state.caregiverId,
          // caregiverName: this.state.caregiverName
          handleLogout: this.handleLogout.bind(this),
          // handleRedirect: this.handleRedirect.bind(this),
          // isLoggedIn: this.isLoggedIn.bind(this),
          // needsSetup: this.needsSetup.bind(this)
        })}
      </div>
    )
  }
}

const requireAuth = function(nextState, replace) {
  if (!!caregiverName) {
    console.log('not logged in');
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
