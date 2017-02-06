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
    var that = this;
    var styleObj = {backgroundColor: '#f5f5f5'};
    return (
        <div className="face-list">
          <ListGroup bsClass="list-group">
            {thumbnailPhotos.length > 0 ? thumbnailPhotos.map((val, ind) => {
              console.log(that.props.current.dbId, that.props.list[ind].dbId)
              if (that.props.current.dbId === that.props.list[ind].dbId) {
                styleObj = {backgroundColor: '#eaeaea'}
              } else {
                styleObj = {backgroundColor: '#f5f5f5'}
              }
              return (
                <ListGroupItem key={ind} style={styleObj} className='list-group-item-face'>
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

