import React from 'react';

import ImagesUpload from './webImagesUpload.js';

var FaceForm = (props) => {
  console.log(props.photos);
  return (
    <div className="face-form">
      <h5>New Face</h5>
      <form>
      <label>
        Name:
        <input type="text" value={props.subjectName} className="subjectName" placeholder="Name" onChange={props.getInput}/>
      </label>
      <br/>
      <label>Picture:
        <ImagesUpload getPhotos={props.getPhotos}/>
      </label>
      <label>Uploaded Photos:
        <div>
          {props.photos.map((photoObj, ind) => <img src={photoObj.photo} key={ind} height="100" width="130"/>)}
        </div>
      </label>
      <br/>
      <label>Description:</label>
      <br/>
        <input type="text" value={props.description} className="description" placeholder="Description" onChange={props.getInput}/>
      <br/>
        <input type="submit" value="Submit" onClick={props.submitForm} />
      </form>
    </div>
  );
}

module.exports = FaceForm;