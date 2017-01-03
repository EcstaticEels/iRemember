//Database
const Sequelize = require('sequelize');

const sequelizeDb = new Sequelize('iremember', 'root', '', {
  host: 'localhost',
  dialect: 'postgres'
});

//Sequelize Schemas
const Caregiver = sequelizeDb.define('caregiver', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  photo: Sequelize.STRING,
  personGroupId: Sequelize.STRING
});

const Patient = sequelizeDb.define('patient', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  photo: Sequelize.STRING,
  personGroupId: Sequelize.STRING
});

const Reminder = sequelizeDb.define('reminder', {
  date: {
    type: Sequelize.DATE
  },
  type: Sequelize.STRING,
  note: Sequelize.STRING,
  recurring: Sequelize.BOOLEAN
});

const Face = sequelizeDb.define('face', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
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

//Associations
Patient.hasOne(Caregiver);
Reminder.belongsTo(Patient);
Reminder.belongsTo(Caregiver);
Face.belongsTo(Patient);
Face.belongsTo(Caregiver);
FacePhoto.belongsTo(Face);

sequelizeDb.sync({force: true});

module.exports = {
  Caregiver,
  Patient,
  Reminder,
  Face,
  FacePhoto
}