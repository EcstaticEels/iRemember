import React from 'react';
import FaceEntry from './webFaceListEntry.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import {Row, Col, Grid} from 'react-bootstrap';


export default class FaceList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var cloudinaryUrls = this.props.list.map(function(photoObj) {
      return photoObj.photo;
    });
    var thumbnailPhotos = this.props.handleCloudinaryUrl(cloudinaryUrls, '134', '94', 'thumb');

    return (
        <div className="face-list">
          <ListGroup bsClass="list-group">
            {thumbnailPhotos.length > 0 ? thumbnailPhotos.map((val, ind) => {
              return (
                <ListGroupItem key={ind}>
                  <FaceEntry 
                  data={this.props.list[ind]} 
                  pic={val} 
                  key={ind} 
                  updateCurrent={this.props.updateCurrent}/>
                </ListGroupItem>
              )}) : null
            } 
          </ListGroup>
        </div>
    );
  }
}

