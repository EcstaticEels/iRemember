import React from 'react';
import Moment from 'moment';
import {Grid, Row, Col} from 'react-bootstrap';

var ReminderEntry = (props) => {
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  return (
    <Row className="show-grid">
      <div className="reminder-entry" onClick={changeCurrent}>
        <Col md={5}>
          <img src={props.data.img} height="100" width="100"/>
        </Col>
        <Col md={7}>
          <div className="reminder-list-container">
            <h4 className="reminder-list-time">{Moment(props.data.date).calendar(null, {sameElse: 'MM/DD/YYYY hh:mm a'}).toString()}</h4>
            <h3 className="reminder-list-title">{props.data.title}</h3>
          </div>
        </Col>
      </div>
    </Row>
  )
};

module.exports = ReminderEntry;