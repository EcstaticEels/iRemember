import React from 'react';
import $ from 'jquery';
import {Button, Row, Col, Grid} from 'react-bootstrap';


export default class Signin extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="app-grid-secondary">
      <div className="app-window">
      <div className="sign-in-container">
        <div className="sign-in-box">
          <h1 className="sign-in-header">Sign In</h1>
          <a href='auth/google'>Sign In with Google</a>
        </div>
      </div>
      </div>
      </div>
    )
  }
}

Signin.contextTypes = {
  router: React.PropTypes.object.isRequired
}

