import React from 'react';
import {Button, Grid} from 'react-bootstrap';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <Grid style={{marginTop: '-82px'}} className="landing" fluid>
      <div className="home-box">
        <div className="home-logo">iRemember</div>
        <p className="home-description">A web and mobile application designed to help family caregivers support loved ones struggling with early-stage Alzheimer’s Disease and dementia.</p>
        <p className="home-bullet"> 
          <span className="home-bullet bold-text"> iRemember </span>
          empowers those with Alzheimer's or dementia to live more independently by providing:</p>
          <ul className="home-bullet-list">
            <li>contextual information about their environment</li>
            <li>a system for familial caregivers to set audio/text reminders</li>
            <li>technology to identify friends and family through facial recognition</li> 
          </ul>
        <button className="sign-up-button">
          <a href="/auth/google" className="sign-up-button-text">Sign up now</a>
        </button>
        <a href="/auth/google" className="sign-in">Sign in</a>
      </div>
    </Grid>
    )    
  }
}

