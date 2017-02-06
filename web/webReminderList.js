import React from 'react';
import ReminderEntry from './webReminderEntry.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';


class ReminderList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var that = this;
    var styleObj = {backgroundColor: '#f5f5f5'};
    return (
      <div className="reminder-list">
        <ListGroup fill>
          {this.props.list.map((val, ind) => {
            if (that.props.current.id === val.id) {
              console.log(that.props.current.id, val.id)
              styleObj = {backgroundColor: '#eaeaea'}
            } else {
              styleObj = {backgroundColor: '#f5f5f5'}
            }
            return (
              <ListGroupItem key={ind} style={styleObj}><ReminderEntry data={val} updateCurrent={this.props.updateCurrent} /></ListGroupItem>
            )
          })}
        </ListGroup>
      </div>
    )
  }
}

module.exports = ReminderList;

