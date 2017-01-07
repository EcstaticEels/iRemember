import React from 'react';
import Moment from 'moment';
import {Grid, Row, Col} from 'react-bootstrap';

var ReminderEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }
  return (

    <Grid>
      <Row className="show-grid">
        <div className="reminder-entry" onClick={changeCurrent}>
          <Col xs={12} md={4}>
            <img src={props.data.img} height="100" width="100"/>
          </Col>
          <Col xs={12} md={8}>
            <h4>{Moment(props.data.date).calendar().toString()}</h4>
            <h4>{props.data.title}</h4>
          </Col>
        </div>
      </Row>
    </Grid>

  )
};

module.exports = ReminderEntry;