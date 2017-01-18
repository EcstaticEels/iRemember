import React from 'react';
import ImageGallery from 'evolved-react-image-gallery';

class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      imageList: []
    }
  }

  render() {
    var cloudinaryUrls = this.props.photos.map(function(photoObj) {
      return photoObj.photo;
    });
    var originalPhotos = this.props.handleCloudinaryUrl(cloudinaryUrls, '700', '450', 'fill');
    var thumbnailPhotos = this.props.handleCloudinaryUrl(cloudinaryUrls, '107', '75', 'thumb');
    var imageList = [];
    for (var i = 0; i < originalPhotos.length; i++) {
      imageList.push({ original: originalPhotos[i], thumbnail: thumbnailPhotos[i], filemeta: {added: cloudinaryUrls[i].createdAt}});
    }

    var gallerymenu;
    return (
      <ImageGallery
        items={imageList}
        gallerymenu={gallerymenu}
        autoPlay={true}
        showFileMeta={true}
        slideInterval={8000}
      />
    );
  }
};


module.exports=Gallery;