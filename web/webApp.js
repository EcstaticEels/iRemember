import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import {Route, Router, browserHistory, IndexRoute, IndexRedirect} from 'react-router';
import { Button, Grid} from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import {caregiverName, needsSetup, patientName, patientImage} from './webMobxStore';

import Nav from './webNav.js';
import Tab from './webTab.js';
import Face from './webFace.js';
import Reminder from './webReminder.js';
import NotFound from './web404.js';
import Signin from './webSignin.js';
import Setup from './webSetup.js';
import Signout from './webSignout.js';
import Home from './webHome.js';
import ServerError from './webError.js';
import PatientProfile from './webPatientProfile.js';

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'reminders'
    };
  }

  getUserInfo(cb) {
    //ajax function that sets the user--> protects the front end
    var that = this;
    $.ajax({
      method: 'GET',
      url: '/auth/user',
      success: function(res) {
        cb(res);
      }.bind(this),
      error: function(err) {
        console.log('error', err);
        browserHistory.push('/')
      }
    });
  }

  componentDidMount() {
    this.getUserInfo(res => {
      if (res) {
        var parsed = JSON.parse(res);
        caregiverName.set(parsed.caregiver.name);
        if (parsed.patient) {
          patientName.set(parsed.patient.name);
          patientImage.set(parsed.patient.photo);
        }
        if (!parsed.caregiver.patientId) {
          needsSetup.set(true);
          browserHistory.push('/setup');
        } else {
          console.log('hi')
          browserHistory.push('/patient/reminders');;
        }
        console.log('logging in, caregiver name: ', caregiverName.get(), ' needssetup: ', needsSetup.get())
      } else {
        console.log('app mount you are not signed in', caregiverName.get(), needsSetup.get())
      }
    });
  }

  changeView(select) {  
    this.setState({
      view: select
    });
  }

  handleLogout(cb) {
    caregiverName.set('');
    needsSetup.set(false);
  }

  handleCloudinaryUrl(urlArray, w, h, type) {
    var newCloudinaryUrlArray = [];
    for (var i = 0; i < urlArray.length; i++) {
      var newUrl = urlArray[i].slice(0, 49) + `w_${w},h_${h},c_${type},g_face/a_auto_right/` + urlArray[i].slice(49);
      newCloudinaryUrlArray.push(newUrl);
    }
    return newCloudinaryUrlArray;
  }

  render() {
    return (
      <div className="app-body">
        <Grid fluid>
          <Nav className="primary-nav" />
        </Grid>

        <div className="app-grid">
          <Grid className="tab-wrapper" fluid>
            <Tab changeView={this.changeView.bind(this)}/>
          </Grid>
          {this.props.children && React.cloneElement(this.props.children, {
            handleLogout: this.handleLogout.bind(this),
            getUserInfo: this.getUserInfo.bind(this),
            handleCloudinaryUrl: this.handleCloudinaryUrl.bind(this)
          })}
        </div>
      </div>
    )
  }
}

const requireAuth = function(nextState, replace) {
  console.log('in require auth allow next:', !!caregiverName.get())
  if (!caregiverName.get()) {
    replace({
      pathname: '/',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

const redirectTo = function(nextState, replace) {
  if (caregiverName.get()) {
    console.log('hi2')
    replace({
      pathname: '/patient',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} onEnter={redirectTo}/>
      <Route path="signout" component={Signout}/>
      <Route path="500" component={ServerError} />
      <Route path='patient' component={PatientProfile} onEnter={requireAuth}>
        <Route path="reminders" component={Reminder} onEnter={requireAuth}/>
        <Route path="setup" component={Setup} onEnter={requireAuth}/>
        <Route path="face" component={Face} onEnter={requireAuth}/>
      </Route>
      <Route path='*' component={NotFound} />
    </Route>
  </Router>
  ), document.getElementById('app'));

module.exports = App;
