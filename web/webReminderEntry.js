import React from 'react';
import Moment from 'moment';
import {Grid, Row, Col} from 'react-bootstrap';

export default class ReminderEntry extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="show-grid" >
        <div className="reminder-entry" onClick={() => this.props.updateCurrent(this.props.data)}>
          <Col md={4}>
            <div className="reminder-graphic-container">
              <img className="reminder-graphic" src={this.props.data.img} height="75" width="75"/>
            </div>
          </Col>
          <Col md={8}>
            <div className="reminder-list-container">
              <h4 className="reminder-list-time">{Moment(this.props.data.date).calendar(null, {sameElse: 'MM/DD/YYYY hh:mm a'}).toString()}</h4>
              <h4 className="reminder-list-title">{this.props.data.title}</h4>
            </div>
          </Col>
        </div>
      </Row>
    )
  }
}