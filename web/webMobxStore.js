import {observable, computed, autorun, action} from "mobx";

const caregiverName = observable('');
const needsSetup = observable(false);
const patientName = observable('');

module.exports.caregiverName = caregiverName;
module.exports.needsSetup = needsSetup;
module.exports.patientName = patientName;
