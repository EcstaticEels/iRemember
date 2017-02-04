import React from 'react';
import {Button} from 'react-bootstrap';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="home-container-secondary">
      <div className="home-container">
        <div className="home-box">
          <h2 className="home-description">iRemember is an application designed to help caregivers support patients 
          struggling with Alzheimer's Disease and other forms of dementia. 
          <br />
          <br />
          iRemember gives caregivers the ability to set reminders for their patients and provides an interface 
          to help patients recognize important people in their lives using their mobile devices.</h2>
          <a href="/auth/google" className="get-started-now-text"><Button bsSize='large' className="get-started-now">Sign up to get started now!</Button></a>
        </div>
      </div>
    </div>
    )    
  }
}
