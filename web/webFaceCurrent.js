import React from 'react';
import LightboxComponent from 'react-lightbox-component';

var Lightbox = LightboxComponent.Lightbox

var FaceCurrent = (props) => {
  var edit = () => {
    props.edit(props.current);
  }

  var images =[
    {
      src: 'http://mysnoringsolutions.info/wp-content/uploads/2011/12/anti-snoring-pills.jpg',
      title: 'image title',
      description: 'image description'
    }
  ]
  // { title: 'image title', description: 'image description', src: 'http://kingofwallpapers.com/pills/pills-011.jpg' }]};

  return (
    <div className="face-current">
      <Lightbox
        images={images}
      />
      <img src={props.current.photos[0]} height="200" width="200"/>
      <div>{props.current.subjectName}</div>
      <div>{props.current.description}</div>
      <button onClick={edit}>Edit</button>
    </div>
  )
};

module.exports = FaceCurrent;
