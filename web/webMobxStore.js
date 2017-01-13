import {observable, computed, autorun, action} from "mobx";

class Store {
  constructor() {
    this.update = this.update.bind(this)
  }
  @observable caregiverName = '';
  @observable needsSetup = false;

  @action update(key, value) {
    this[key] = value;
    console.log(key, ': ', value);
  }
}

const WebMobxStore = new Store();
export default WebMobxStore;