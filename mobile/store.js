import {observable, autorun, action} from "mobx";

var that

class Store {
  constructor () {
    that = this;
    this.update = this.update.bind(this);
  }

  //Observable variables
  @observable id = 1;
  @observable name = 'Bob';
  @observable reminders = [];
  @observable current = {};

  //Accessible Actions

  //Change observable variable value to new value
  @action update(key, value) {
    // console.log(this);
    // console.log('before', key, that[key]);
    that[key] = value;
    // console.log('after', key, that[key]);
  }

  //Change date from database to JS Date instance
  @action convertDate (date) {
    var year = date.slice(0, 4);
    var month = date.slice(5, 7) - 1;
    var day = date.slice(8, 10);
    var hour = date.slice(11, 13);
    var minute = date.slice(14, 16);

    return new Date(year, month, day, hour, minute);
  }

  //Get closest Date in given dayOfWeek from setTime in milliseconds;
  @action getDifferenceInDays (dayOfWeek, setTime) {
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var dayOfWeekInd = daysOfWeek.indexOf(dayOfWeek);
    var setTimeInd = setTime.getDay();
    var differenceInDays = dayOfWeekInd - setTimeInd;
    if(differenceInDays < 0) {
      differenceInDays = 7 + differenceInDays;
    }
    return differenceInDays;
  } 
}

var MobXStore = new Store();
module.exports = MobXStore;

// var person = observable({
//     // observable properties:
//     name: "John",
//     age: 42,
//     showAge: false,

//     // computed property:
//     get labelText() {
//         return this.showAge ? `${this.name} (age: ${this.age})` : this.name;
//     },

//     // action:
//     setAge: action(function() {
//         this.age = 21;
//     })
// });

// // object properties don't expose an 'observe' method,
// // but don't worry, 'mobx.autorun' is even more powerful
// autorun(() => console.log(person.labelText));

// person.name = "Dave";
// // prints: 'Dave'

// person.setAge(21);
// // etc