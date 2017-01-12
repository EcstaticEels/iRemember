import React from 'react';
import Auth from './webAuth.js';
import $ from 'jquery';

export default class Signout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Auth.logout();
    $.ajax({
      method: 'GET',
      url: '/logout',
      success: function(res) {
        console.log(res);
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