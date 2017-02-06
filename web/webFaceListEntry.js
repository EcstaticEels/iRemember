import React from 'react';
import {Grid, Row, Col, Image} from 'react-bootstrap';

var FaceEntry = (props) => {
  var changeCurrent = () => {
    props.updateCurrent(props.data);
  };
  
  var photoView = props.data ? <Image src={props.pic} className='facePic' responsive/> : null;

  return (
    <Row className="show-grid">
      <div onClick={changeCurrent} className="face-list-row">
        <Col md={6}>
          <div className="face-list-image-container">
            <div className="face-list-image-container-inner">
              {photoView}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="face-list-name-container">
            <div className="face-list-name-container-inner">
              <h3 className='face-list-name'>{props.data.subjectName}</h3>
            </div>
          </div>
        </Col>
      </div>
    </Row>
  )
};

module.exports = FaceEntry;