import React from 'react';


export default class ImagePreview extends React.Component {
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
    return (
      <div>
        <h1>Hi</h1>
        {this.props.imagePreviewUrls.length > 0 ? this.props.imagePreviewUrls.map((imagePreview, ind) => <img src={imagePreview} key={ind} className='preview-images'/>) : <h1>hi</h1>} 
      </div>
    );
  }
}