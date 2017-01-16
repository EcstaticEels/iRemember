import React from 'react';


export default class ImagePreviewCrop extends React.Component {
  constructor(props) {
    super(props);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextProps.imagePreviewRerender;  
  // }

  // <ReactCrop 
  //   src={imagePreview} 
  //   crop={crop}
  //   onComplete={(crop, pixelCrop) => {
  //     console.log(ind, crop);
  //     console.log(ind, pixelCrop);
  //     that.props.handleCropUpdate(ind, pixelCrop)
  //   }} 
  //   key={ind}
  // />
  render() {
    // var crop = {
    //   width: 60,
    //   aspect: 16/12
    // }
    var that = this;
    return (
      <div>
        {this.props.imagePreviewUrls.map(function(imagePreview, ind) {
          return (
            <img src={imagePreview} key={ind} className='preview-images'/>
          )})
        }
      </div>
    );
  }
}