import React from 'react';
import FaceEntry from './webFaceListEntry.js';

var FaceList = (props) => (
  <div className="face-list">{
    props.list.map((val, ind) => <FaceEntry data={val} key={ind} updateCurrent={props.updateCurrent}/>)
  }</div>
);

module.exports = FaceList;