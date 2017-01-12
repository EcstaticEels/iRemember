import React from 'react';
import $ from 'jquery';
import Auth from './webAuth.js';
import { browserHistory } from 'react-router'

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.handleLogin(() => {
      if (Auth.loggedIn() && Auth.needSetup()) {
        this.props.handleLoginRedirect('/setup');
      } else if (Auth.loggedIn()) {
        this.props.handleLoginRedirect('/')
      }
    }); 
  }
  
  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <a href='auth/google'>Sign In with Google</a>
      </div>
    )
  }
}

Signin.contextTypes = {
  router: React.PropTypes.object.isRequired
}