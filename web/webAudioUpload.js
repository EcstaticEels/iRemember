import React from 'react';

var AudioUpload = (props) => (
  <div className="audio-upload">
      <input type="text" className="audioName"/><br/>
      <input type="file" className="audio" onChange={props.getAudio}/><br/>
  </div>
);

module.exports = AudioUpload;


