import React from 'react';

var ImageUpload = (props) => (
  <div className="image-upload">
     <h1>Microsoft Face API Test</h1>
    <h3>Caregiver: upload a face</h3>
    <form action="/web/identify" enctype="multipart/form-data" method="POST">
      <input type="text" name="name"/><br/>
      <input type="file" name="upload" multiple="multiple"/><br/>
      <input type="submit" value="Upload"/>
    </form>
    <h3>Patient: identify a face</h3>
    <form action="/mobile/identify" enctype="multipart/form-data" method="POST">
      <input type="file" name="upload"/><br/>
      <input type="submit" value="Upload"/>
    </form>
  </div>
);

module.exports = ImageUpload;


