//Basic server
const express = require('express');
const app = express();
var path = require('path');

var axios = require('axios');

//Database
const db = require('../database/db.js');

//Middleware
const bodyParser = require('body-parser');
const morgan = require('morgan');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

// Initialize multers3 with our s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) {
      cb(null,'picture.jpeg');
    }
  })
});

//Express static
app.use(express.static(path.join(__dirname, '..', 'public')));

//Controllers
const webControllers = require('./webControllers.js');
const mobileControllers = require('./mobileControllers.js');

//Web
app.post('/web/identify', webControllers.addFace);
app.put('/web/identify', webControllers.updateFace);
app.get('/web/identify', webControllers.retrieveFaces);
app.post('/web/reminders', webControllers.addReminder);
app.get('/web/reminders', webControllers.retrieveReminders);
app.put('/web/reminders', webControllers.updateReminder);
app.delete('/web/reminders', webControllers.deleteReminder);
//Mobile
app.post('/mobile/identify', upload.single('picture'), mobileControllers.identifyFace);
app.get('/mobile/reminders', mobileControllers.retrieveReminders);
app.put('/mobile/reminders', mobileControllers.updateReminder);
app.post('/mobile/pushNotification', mobileControllers.addPushNotification);

//Configure express to serve index.html at every other route that comes to server
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/webIndex.html'))
});

app.listen(3000, function () {
  console.log('iRemember is running on port 3000!')

  // //Create new person group
  // axios.put('https://api.projectoxford.ai/face/v1.0/persongroups/EcstaticEelsForever', {
  //   params : {
  //     personGroupId: 'EcstaticEelsForever'
  //   },
  //   headers: {
  //     'Ocp-Apim-Subscription-Key': process.env.MICROSOFT_API_KEY
  //   }
  // })
  // //Insert into database
  // .then(() => {
  //   db.Caregiver.build({
  //     name: 'Sara Bolan',
  //     photo: '',
  //     personGroupID: 'EcstaticEelsForever'
  //   }).save()
  // })
  // .catch((err) => {
  //   console.log(err)
  // })
  // .then(() => {
  //   db.Patient.build({
  //     name: 'John Watt',
  //     photo: '',
  //     personGroupID: 'EcstaticEelsForever'
  //   }).save();
  // })
  // .catch((err) => {
  //   console.log(err)
  // })
});



