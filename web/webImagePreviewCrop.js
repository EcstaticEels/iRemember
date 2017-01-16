import React from 'react';
import ReactCrop from 'react-image-crop';


export default class ImagePreviewCrop extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.imagePreviewRerender;  
  }

  render() {
    var crop = {
      width: 60,
      aspect: 16/12
    }
    var that = this;
    return (
      <div>
        <h1>ImagePreviewCrop</h1>
        <div>
        {this.props.imagePreviewUrls.map(function(imagePreview, ind) {
          return (
            <ReactCrop 
              src={imagePreview} 
              crop={crop}
              onComplete={(crop, pixelCrop) => {
                console.log(ind, crop);
                console.log(ind, pixelCrop);
                that.props.handleCropUpdate(ind, pixelCrop)
              }} 
              key={ind}
            />
          )})
        }
        </div>
      </div>
    );
  }
}