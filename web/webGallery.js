import React from 'react';
import Slider from 'react-slick';

var Gallery = (props) => {

  var settings = {
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
};

  return (
    <Slider {...settings}>{
      props.photos.map((photo, ind) => <img className="slider-img" src={photo}/>)
    }</Slider>
  );
};

module.exports=Gallery;