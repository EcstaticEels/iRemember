import React from 'react';
import ReminderEntry from './webReminderEntry.js';
import {ListGroup, ListGroupItem} from 'react-bootstrap';


class ReminderList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var styleObj = this.props.showForm ? {padding: '0px'} : {};

    return (
      <div className="reminder-list" style={styleObj}>
        <ListGroup fill>
          {this.props.list.map((val, ind) => {
            return (
              <ListGroupItem key={ind}><ReminderEntry data={val} updateCurrent={this.props.updateCurrent}/></ListGroupItem>
            )
          })}
        </ListGroup>
      </div>
    )
  }
}

module.exports = ReminderList;