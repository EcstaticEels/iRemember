import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

var FaceEntry = (props) => {
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  };
  var photoView = props.data ? <img src={props.pic} className='facePic'/> : null;

  return (
      <Row className="show-grid">
        <div className="face-list-image" onClick={changeCurrent}>
          <Col md={6}>
            {photoView}
          </Col>
        </div>
        <Col md={6}>
          <div>
            <h3 className='face-list-name'>{props.data.subjectName}</h3>
          </div>
        </Col>
      </Row>
  )
};

module.exports = FaceEntry;