import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

// import WebNav from '../../web/webNav.js';
import WebNav from '../../web/webNav.js';

// describe('<WebNav />', () => {

//   it('renders Navigation', () => {
//     const wrapper = shallow(<WebNav />);
//     expect(wrapper.html()).to.contain('iRemember');
//   });

// });

describe('<WebNav />', () => {

  it('renders Navigation', () => {
    const wrapper = shallow(<WebNav />);
    expect(wrapper.html()).to.contain('iRemember');
  });

});

// expect(WebNav.prototype.componentDidMount.calledOnce).to.equal(true);