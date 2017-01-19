import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

var FaceEntry = (props) => {
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  };
  
  var photoView = props.data ? <img src={props.pic} className='facePic'/> : null;

  return (
    <Row className="show-grid">
      <div className="face-list-entry" onClick={changeCurrent}>
        <div className="face-list-image">
          <Col md={5}>
            {photoView}
          </Col>
        </div>
        <Col md={7}>
          <div className="face-list-name-container">
            <h3 className='face-list-name'>{props.data.subjectName}</h3>
          </div>
        </Col>
      </div>
    </Row>
  )
};

module.exports = FaceEntry;