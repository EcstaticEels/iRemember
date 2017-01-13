import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, browserHistory, IndexRoute, IndexRedirect} from 'react-router';
import { Jumbotron, Button} from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {caregiverName, needsSetup, patientName} from './webMobxStore';

import Nav from './webNav.js';
import Tab from './webTab.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';
import NotFound from './web404.js';
import Signin from './webSignin.js';
import Setup from './webSetup.js';
import Signout from './webSignout.js';

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'reminders'
    };
  }

  componentDidMount() {
    //ajax function that sets the user--> protects the front end
    var that = this;
    $.ajax({
      method: 'GET',
      url: '/user',
      success: function(res) {
        if (res) {
          var parsed = JSON.parse(res);
          console.log(parsed)
          caregiverName.set(parsed.caregiver.name);
          if (parsed.patient) {
            patientName.set(parsed.patient.name);
          }
          if (!parsed.caregiver.patientId) {
            needsSetup.set(true);
            browserHistory.push('/setup');
          } else {
            browserHistory.push('/reminders');;
          }
          console.log('logging in, caregiver name: ', caregiverName.get(), ' needssetup: ', needsSetup.get())
        } else {
          console.log('app mount you are not signed in', caregiverName.get(), needsSetup.get())
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
    caregiverName.set('');
    needsSetup.set(false);
    console.log('logging out, caregiver name: ', caregiverName.get(), ' needssetup: ', needsSetup.get())
  }

  render() {
    return (
      <div className="app-body">
        <Nav />

        <Tab changeView={this.changeView.bind(this)}/>
        {this.props.children && React.cloneElement(this.props.children, {
          // caregiverId: this.state.caregiverId,
          handleLogout: this.handleLogout.bind(this)
          // isLoggedIn: this.isLoggedIn.bind(this),
          // needsSetup: this.needsSetup.bind(this)
        })}
      </div>
    )
  }
}


const requireAuth = function(nextState, replace) {
  console.log('in require auth allow next:', !!caregiverName.get())
  if (!caregiverName.get()) {
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
