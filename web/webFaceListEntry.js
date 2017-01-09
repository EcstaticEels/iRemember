import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

var FaceEntry = (props) => {
  console.log(props.data.photos)
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  };

  var photoView = props.data.photos.length > 0 ? <img src={props.data.photos[0].photo} className='facePic'/> : null;

  return (
    <Grid>
      <Row className="show-grid">
        <div className="face-entry" onClick={changeCurrent}>
          <Col xs={12} md={4}>
            {photoView}
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