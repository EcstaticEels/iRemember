import React from 'react';
import {Button, Row, Col, Grid} from 'react-bootstrap';

export default class ImagePreviewEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStyle: {
        border: ''
      }, 
      imageInfo: ''
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.success !== this.props.success) {
      if (this.props.success === true) {
        this.setState({
          imageStyle: {
            border: '10px solid green',
          }, 
          imageInfo: 'This image is good to upload!'
        });
      } else if (this.props.success === false) {
        this.setState({
          imageStyle: {
            border: '10px solid red',
          }, 
          imageInfo: "Multiple faces were detected in this photo--please upload a new image depicting only the subject's face"
        });
      } else if (this.props.success === null) {
        this.setState({
          imageStyle: {
            border: '10px solid grey',
          }, 
          imageInfo: "No faces detected in this photo--please upload a new image with the above guidelines."
        })
      }
    }

  }


//REMEMBER TO CLEAR DETECT ARRAY AFTER ABANDONING FORM

  render() {
    return (
      <div key={this.props.index} >
        <Row className="show-grid">
          <Col xs={6} md={6} >
            <div className='preview-image-container' >
              <img src={this.props.photo} key={this.props.index} className='preview-image' style={this.state.imageStyle}/>
            </div>
          </Col>
          <Col xs={6} md={6} >
            <div className="image-preview-info">
              <p>{this.state.imageInfo}</p>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

