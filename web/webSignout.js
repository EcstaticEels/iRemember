import React from 'react';
import $ from 'jquery';

import {observer} from 'mobx-react';
import WebMobxStore from './webMobxStore';

var {caregiverName} = WebMobxStore;
var {needsSetup} = WebMobxStore;

export default class Signout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/logout',
      success: function(res) {
        this.props.handleLogout();
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    return (<p>You are now logged out</p>);
  }
}

Signout.contextTypes = {
  router: React.PropTypes.object.isRequired
}