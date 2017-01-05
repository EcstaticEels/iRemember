import React from 'react';
import Slider from 'react-slick';

class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }
  next() {
    this.slider.slickNext()
  }
  previous() {
    this.slider.slickPrev()
  }

  render() {
    const settings = {
      centerMode: true,
      centerPadding: '300px',
      slidesToShow: 1,
      adaptiveHeight: true,
      fade: true,
      slidesToScroll: 1,
      infinite: false,
      touchMove: true,
      swipe: true,
      initialSlide: 0,
      dots: true
    };
    return (
      <div>
        <div style={{textAlign: 'center'}}>
          <button className='button' onClick={this.previous}>Previous</button>
          <button className='button' onClick={this.next}>Next</button>
        </div>
        <div>
          <Slider {...settings} ref={c => this.slider = c }>{
            this.props.photos.map((photoObj, ind) => <img className='gallery-photo' src={photoObj.photo} key={ind}/>)
          }</Slider>
        </div>
      </div>
    );
  }
};

module.exports=Gallery;