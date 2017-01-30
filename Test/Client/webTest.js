import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import Home from '../../web/webHome.js';
import WebNav from '../../web/webNav.js';

import Face from '../../web/webFace.js';
import FaceList from '../../web/webFaceList.js';
import FaceListEntry from '../../web/webFaceListEntry.js';
import FaceForm from '../../web/webFaceForm.js';

import Reminder from '../../web/webReminder.js';
import ReminderList from '../../web/webReminderList.js';
import ReminderEntry from '../../web/webReminderEntry.js';
import ReminderForm from '../../web/webReminderForm.js';


var sampleFaceList = [{"dbId":6,"subjectName":"George Clooney","description":"asdfasdfasdfasdf","photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870479/gscshmpbhv1nuskq4yyg.jpg","audio":null,"photos":[{"id":21,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870479/ojjyynywvic0f0n7ie2t.jpg","createdAt":"2017-01-20T00:01:22.000Z","updatedAt":"2017-01-20T00:01:22.000Z","faceId":6},{"id":19,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870479/gscshmpbhv1nuskq4yyg.jpg","createdAt":"2017-01-20T00:01:21.000Z","updatedAt":"2017-01-20T00:01:21.000Z","faceId":6},{"id":20,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870479/aq5lle9dov9ggrvvy9nt.jpg","createdAt":"2017-01-20T00:01:21.000Z","updatedAt":"2017-01-20T00:01:21.000Z","faceId":6}]},{"dbId":7,"subjectName":"Sun Nam","description":"brother","photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/uem5lpdvoz1xvzyezu4y.jpg","audio":null,"photos":[{"id":30,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/uem5lpdvoz1xvzyezu4y.jpg","createdAt":"2017-01-20T00:07:39.000Z","updatedAt":"2017-01-20T00:07:39.000Z","faceId":7},{"id":23,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/shp2eya6gzzbihhcj0xc.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":24,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/xrlcnfzqanuchqj0uged.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":25,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/n1fxnf028r2hfnvbxxjh.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":26,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/ux7kvuvgduxco1ippyup.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":27,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/njzrkgbw13svasjfg3jg.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":28,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/potudyfy7exaq0cal1nw.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":29,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/fxpo9wt0x14cidf5gq5h.jpg","createdAt":"2017-01-20T00:07:38.000Z","updatedAt":"2017-01-20T00:07:38.000Z","faceId":7},{"id":22,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484870856/tbhlpvdyll1uetvoklax.jpg","createdAt":"2017-01-20T00:07:37.000Z","updatedAt":"2017-01-20T00:07:37.000Z","faceId":7}]},{"dbId":8,"subjectName":"Lisa Nam","description":"Lisa","photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/ce34oli9w6v2k5qbjt2l.jpg","audio":"http://res.cloudinary.com/dgpb4nmh4/raw/upload/v1484935395/gmapiwfj7dlk56bxtqfr.wav","photos":[{"id":38,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/m3fkkkjki2meuu8w94y9.jpg","createdAt":"2017-01-20T18:03:21.000Z","updatedAt":"2017-01-20T18:03:21.000Z","faceId":8},{"id":33,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/vnvp1egrwcxtdwjtdtfw.jpg","createdAt":"2017-01-20T18:03:20.000Z","updatedAt":"2017-01-20T18:03:20.000Z","faceId":8},{"id":34,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/hm7dyrgyujp2qqeh6mxi.jpg","createdAt":"2017-01-20T18:03:20.000Z","updatedAt":"2017-01-20T18:03:20.000Z","faceId":8},{"id":35,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/gvdsp881o2ubw8kermd8.jpg","createdAt":"2017-01-20T18:03:20.000Z","updatedAt":"2017-01-20T18:03:20.000Z","faceId":8},{"id":36,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/ce34oli9w6v2k5qbjt2l.jpg","createdAt":"2017-01-20T18:03:20.000Z","updatedAt":"2017-01-20T18:03:20.000Z","faceId":8},{"id":37,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/cf3xddpatifzndeccsqz.jpg","createdAt":"2017-01-20T18:03:20.000Z","updatedAt":"2017-01-20T18:03:20.000Z","faceId":8},{"id":31,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/mzmqea8zu8c4cevakc47.jpg","createdAt":"2017-01-20T18:03:19.000Z","updatedAt":"2017-01-20T18:03:19.000Z","faceId":8},{"id":32,"photo":"http://res.cloudinary.com/dgpb4nmh4/image/upload/v1484935393/ilzgkaomstb31fioydit.jpg","createdAt":"2017-01-20T18:03:19.000Z","updatedAt":"2017-01-20T18:03:19.000Z","faceId":8}]}]


describe('<Home />', () => {

  it('has a homepage', () => {
    const wrapper = shallow(<Home />);
    // expect(wrapper.find('.home-container')).to.have.length(1);
  });

});

describe('<WebNav />', () => {

  it('renders navigation', () => {
    const wrapper = shallow(<WebNav />);
    expect(wrapper.html()).to.contain('iRemember');
    // Logged in as:
    //Sign In signout
  });

});

describe('<FaceList />', () => {

  it('renders a list', () => {
    const wrapper = shallow(<Face />);
    expect(wrapper.find('.face-list')).to.have.length(0);
    expect(wrapper.find(FaceList).render().find('.face-list')).to.have.length(1);
  });

  // it('renders each entry', () => {
  //   const wrapper = shallow(<FaceList list={sampleFaceList}/>);
  //   wrapper.find('.foo').forEach(function (node) {
  //     expect(node.hasClass('foo')).to.equal(true);
  //   });
    // expect(wrapper.find(FaceList).render().prop('showForm')).to.equal("Success!");
  // });

  //set show Form to true => renders Form
  // it('renders a form', () => {
  //   const wrapper = mount(<Face />);
  //   expect(wrapper.find('.face-form')).to.have.length(0);
    
  // });
});

// describe('<FaceForm />', () => {

//   it('contains all forms', () => {
//     const wrapper = shallow(<FaceForm photos={[]} imagePreviewUrls={[]}/>);
//     expect(wrapper.containsAllMatchingElements([
//       <label>Name: </label>,
//       <label>Description:</label>
//     ])).to.equal(true);
//   });

// });



// wrapper.setState({ showForm: true });
//     expect(wrapper.find('.face-form')).to.have.length(1);

// expect(WebNav.prototype.componentDidMount.calledOnce).to.equal(true);
// expect(wrapper.containsAllMatchingElements([])).to.equal(true);



describe('<Reminder />', () => {

  // it('renders a list', () => {
  //   const wrapper = shallow(<Reminder />);
  //   expect(wrapper.find('.')).to.have.length(0);
  //   expect(wrapper.find(FaceList).render().find('.face-list')).to.have.length(1);
  // });

  // it('renders each entry', () => {
  //   const wrapper = shallow(<FaceList list={sampleFaceList}/>);
  //   wrapper.find('.foo').forEach(function (node) {
  //     expect(node.hasClass('foo')).to.equal(true);
  //   });
    // expect(wrapper.find(FaceList).render().prop('showForm')).to.equal("Success!");

  //set show Form to true => renders Form
  // it('renders a form', () => {
  //   const wrapper = mount(<Face />);
  //   expect(wrapper.find('.face-form')).to.have.length(0);
    
  // });
});