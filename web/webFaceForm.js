import React from 'react';

import ImagesUpload from './webImagesUpload.js';

var FaceList = (props) => (
  <div className="face-form">
    <h5>New Face</h5>
    <form>
    <label>
      Name:
      <input type="text" value={props.subjectName} className="subjectName" placeholder="Name" onChange={props.getInput}/>
    </label>
    <br/>
    <label>Picture:
    <ImagesUpload photos={props.photos} getPhotos={props.getPhotos} editMode={props.editMode}/>
    </label>
    <br/>
    <label>Descriptions:</label>
    <br/>
    <input type="text" value={props.description} className="description" placeholder="Descriptions" onChange={props.getInput}/>
    <br/>
    <input type="submit" value="Submit" onClick={props.submitForm}/>
    </form>
  </div>
);

module.exports = FaceList;