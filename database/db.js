//Database
const Sequelize = require('sequelize');
const sequelizeDb = new Sequelize('iremember', 'ecstaticeels', 'cool', {
  host: 'localhost',
  dialect: 'mysql'
});

//Sequelize Schemas
const Caregiver = sequelizeDb.define('caregiver', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  personGroupID: Sequelize.STRING, 
  googleId: Sequelize.STRING,
  photo: Sequelize.STRING
});

const Patient = sequelizeDb.define('patient', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true
  },
  personGroupID: Sequelize.STRING,
  personId: Sequelize.STRING,
  photo: Sequelize.STRING
});

const Reminder = sequelizeDb.define('reminder', {
  date: {
    type: Sequelize.DATE
  },
  type: Sequelize.STRING,
  note: Sequelize.STRING,
  recurring: Sequelize.BOOLEAN,
  recurringDays: Sequelize.STRING(300),
  notificationId: {
    type: Sequelize.STRING(300),
    allowNull: true,
    unique: true
  },
  registered: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  audio: Sequelize.STRING,
  title: Sequelize.STRING
});

const Face = sequelizeDb.define('face', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  personId: {
    type: Sequelize.STRING
  },
  description: Sequelize.STRING,
  photo: Sequelize.STRING,
  audio: Sequelize.STRING
});

const FacePhoto = sequelizeDb.define('facePhoto', {
  photo: Sequelize.STRING
});

const PatientPhoto = sequelizeDb.define('patientPhoto', {
  photo: Sequelize.STRING
});

//Associations
Patient.hasOne(Caregiver);
Reminder.belongsTo(Patient);
Reminder.belongsTo(Caregiver);
Face.belongsTo(Patient);
Face.belongsTo(Caregiver);
FacePhoto.belongsTo(Face);
PatientPhoto.belongsTo(Patient);

sequelizeDb.sync();

module.exports = {
  Caregiver,
  Patient,
  Reminder,
  Face,
  FacePhoto,
  PatientPhoto
}