import React from 'react';
import $ from 'jquery';
import {Button, Row, Col, Grid} from 'react-bootstrap';
import { browserHistory } from 'react-router';

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
      url: '/auth/logout',
      success: function(res) {
        this.props.handleLogout(() => {
          browserHistory.push('/')
        });
      }.bind(this),
      error: function(err) {
        console.log('error', err);
      }
    });
  }

  render() {
    return (
      <div></div>
    );
  }
}

Signout.contextTypes = {
  router: React.PropTypes.object.isRequired
}