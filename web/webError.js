import React from 'react';
import {Button} from 'react-bootstrap';

export default class ServerError extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="error-container-secondary">
      <div className="error-container">
        <div className="error-box">
          <h1 className="error-description">Oops, we're sorry, something went wrong! Please rest assured that our developers are working on it, so please try again soon.</h1>
        </div>
      </div>
    </div>
    )    
  }
}
