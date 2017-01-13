import {observable, computed, autorun, action} from "mobx";

const caregiverName = observable('');
const needsSetup = observable(false);

module.exports.caregiverName = caregiverName;
module.exports.needsSetup = needsSetup;
