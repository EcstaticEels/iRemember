import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

var FaceEntry = (props) => {
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  };
  var photoView = props.data ? <img src={props.pic} className='facePic'/> : null;

  return (
    <Grid>
      <Row className="show-grid">
        <div className="face-entry" onClick={changeCurrent}>
          <Col xs={12} md={4}>
            {photoView}
          </Col>
          <Col xs={12} md={8}>
            <h3 className='face-name'>{props.data.subjectName}</h3>
          </Col>
        </div>
      </Row>
    </Grid>
  )
};

module.exports = FaceEntry;