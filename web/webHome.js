import React from 'react';
import {Button, Grid} from 'react-bootstrap';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <Grid className="landing" fluid>
      <div className="home-box">
        <div className="home-logo">iRemember</div>
        <p className="home-description">Designed to help caregivers support patients struggling with Alzheimer’s Disease and other forms of dementia.</p>
        <p className="home-bullet">With 
          <span className="home-bullet bold-text"> iRemember</span>
          , you can: 
          <ul className="home-bullet-list">
            <li>set reminders</li>
            <li>help care recipients recognize loved ones</li> 
            <li>easy mobile app</li>
          </ul>
        </p>
        <button className="sign-up-button">
          <a href="/auth/google" className="sign-up-button-text">Sign up now</a>
        </button>
        <a href="/signin" className="sign-in">Sign in</a>
      </div>
    </Grid>
    )    
  }
}

