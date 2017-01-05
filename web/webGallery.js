import React from 'react';
import Slider from 'react-slick';

var Gallery = (props) => {

  var settings = {
  centerMode: true,
  centerPadding: '500px',
  slidesToShow: 1,
  arrows: true,
  adaptiveHeight: true,
  fade: true,
  focusOnSelect: true,
  touchMove: true,
  arrows: true,
  speed: 500,
  dots: true
};

  return (
    <div>
      <button type="button" class="slick-prev">Previous</button>
      <Slider {...settings}>{
        props.photos.map((photoObj, ind) => <img className="slider-img" src={photoObj.photo} key={ind}/>)
      }</Slider>
      <button type="button" class="slick-next">Next</button>
    </div>
  );
};

module.exports=Gallery;