import React from 'react';
import Moment from 'moment';
import {Grid, Row, Col} from 'react-bootstrap';

var ReminderEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  var mapIcons = (type) => {
    if (type === 'medication') {
      return '/pill_logo1.jpg';
    } else if (type === 'appointment') {
      return '/appointment_logo3.jpg';
    } else {
      return '/reminder_logo.jpg';
    }
  }

  return (

    <Grid>
      <Row className="show-grid">
        <div className="reminder-entry" onClick={changeCurrent}>
          <Col xs={12} md={4}>
            <img src={mapIcons(props.data.type)} height="100" width="100"/>
          </Col>
          <Col xs={12} md={8}>
            <h4>{Moment(props.data.date).calendar().toString()}</h4>
            <h4>{props.data.note}</h4>
          </Col>
        </div>
      </Row>
    </Grid>

  )
};

module.exports = ReminderEntry;