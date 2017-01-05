import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

var FaceEntry = (props) => {
  
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  }

  return (
    <Grid>
      <Row className="show-grid">
        <div className="face-entry" onClick={changeCurrent}>
          <Col xs={12} md={4}>
            <img src={props.data.photos[0].photo} height="100" width="100"/>
          </Col>
          <Col xs={12} md={8}>
            <h3>{props.data.subjectName}</h3>
          </Col>
        </div>
      </Row>
    </Grid>
  )
};

module.exports = FaceEntry;