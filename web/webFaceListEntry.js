import React from 'react';
import {Grid, Row, Col, Image} from 'react-bootstrap';

var FaceEntry = (props) => {
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  };
  
  var photoView = props.data ? <Image src={props.pic} className='facePic' responsive/> : null;

  return (
    <Row className="show-grid">
      <div onClick={changeCurrent}>
        <div className="face-list-image">
          <Col xs={5}>
            {photoView}
          </Col>
        </div>
        <Col xs={7} className="face-list-btn-name">
          <h3 className='face-list-name'>{props.data.subjectName}</h3>
        </Col>
      </div>
    </Row>
  )
};

module.exports = FaceEntry;