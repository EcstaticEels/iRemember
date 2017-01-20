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
    var styleOptionsForSuccessDetect = {
      undefined: {
        imageStyle: {
          border: '10px solid green',
        }, 
        imageInfo: 'This image is good to upload!'
      },
      found_match: {
        imageStyle: {
          border: '10px solid green',
        }, 
        imageInfo: 'This image has only one face, which matches the faces previously uploaded for this subject. It is good to upload!'
      },
      found_no_match: {
        imageStyle: {
          border: '10px solid red',
        }, 
        imageInfo: 'This image has only one face, but matches the face of a different subject previously uploaded.'
      },
      not_found: {
        imageStyle: {
          border: '10px solid red',
        }, 
        imageInfo: 'This image has only one face, but does not match the faces previously uploaded for this subject or any other faces previously uploaded.'
      },
      multiple_candidates: {
        imageStyle: {
          border: '10px solid red',
        }, 
        imageInfo: 'This image has only one face, but matches the faces of multiple subjects previously uploaded.'
      }
    }
    if (prevProps.success === undefined || prevProps.success[0] !== this.props.success[0]) {
      if (this.props.success[0] === true) {
        this.setState(styleOptionsForSuccessDetect[this.props.success[1]]);
      } else if (this.props.success[0] === false) {
        this.setState({
          imageStyle: {
            border: '10px solid red',
          }, 
          imageInfo: "Multiple faces were detected in this photo--please upload a new image depicting only the subject's face"
        });
      } else if (this.props.success[0] === null) {
        this.setState({
          imageStyle: {
            border: '10px solid grey',
          }, 
          imageInfo: "No faces detected in this photo--please upload a new image with the above guidelines."
        })
      }
    }
  }
          // <Col xs={6} md={6} >
          //   <div className="image-preview-info">
          //     <p>{this.state.imageInfo}</p>
          //   </div>
          // </Col>


//REMEMBER TO CLEAR DETECT ARRAY AFTER ABANDONING FORM

  render() {
    return (
      <div key={this.props.index} >
        <Row className="show-grid">
          <div className='preview-image-container' >
            <img src={this.props.photo} key={this.props.index} className='preview-image' style={this.state.imageStyle}/>
          </div>
        </Row>
      </div>
    );
  }
}

