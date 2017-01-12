import {observable, autorun, action} from "mobx";

var that

class Store {
  constructor () {
    that = this;
  }
  @observable reminders = 'hi';
  @observable currentReminder = {};

  @action change (key, value) {
    console.log('this', that)
    console.log(that.reminders, that[key], 'key', key, 'value', value);
    that[key] = value;
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