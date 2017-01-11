import React from 'react';

export default class Signin extends React.Component {
  constructor(props) {
    super(props);
  }


  getInput(event) {
    var key = event.target.getAttribute('class');
    var value = event.target.value;
    var obj = {};
    obj[key] = value;
    this.setState(obj);
  }
  
  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <a href="/auth/google">Sign In with Google</a>
      </div>
    )
  }
}