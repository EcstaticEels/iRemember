const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const request = require('request');

const db = require('../database/db.js');

//headers for the Microsoft Face API
const microsoftHeaders = {
  "Content-Type": "application/json", 
  "Ocp-Apim-Subscription-Key": process.env.MICROSOFT_API_KEY
};

//Set up cloudinary--env variables in .env file
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

//Helper function to upload photos to cloudinary
const uploadPhoto = function(req, cb) {
  const form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    const urlArray = [];
    files.upload.forEach(function(file) {
      cloudinary.uploader.upload(file.path, function(result) { 
        urlArray.push(result.url);
        if (urlArray.length === files.upload.length) {
          cb(urlArray);
        }
      });
    });
  });
};

// reminder = {
//   date: "Mon Jan 02 2017 16:54:51 GMT-0800 (PST)",
//   type: "medication",
//   note: "Take 1 aleve pill (blue pill with 'A' logo)",
//   recurring: true
// }

// {time: "2017-01-04T12:59", recurring: "false", type: undefined, img: "C:\fakepath\6506.pdf", note: "Take pill"}


module.exports = {
  addFace: (req, res) => {
    let caregiverId = 1; //should be req.body.caregiverId
    uploadPhoto(req, (urlArray) => {
      console.log(urlArray);
      db.Caregiver.findOne({
        where: {
          id: caregiverId
        }
      })
      .then(caregiver => {
        let personGroupId = caregiver.get('personGroupID');
        request.post({
          headers: microsoftHeaders,
          url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons`,
          body: JSON.stringify({
            "name": 'Bob Dolan',//should be req.body.faceName
            "userData": 'Next-door neighbor, waters lawn every Tuesday and Thursday',//should be req.body.description
          })
        }, (err, response, body) => {
          if (err) {
            console.log(err);
          }
          let createdPerson = JSON.parse(body);
          db.Face.create({
            name: 'Bob Dolan', //should be req.body.faceName
            description: 'Next-door neighbor, waters lawn every Tuesday and Thursday', //should be req.body.description
            photo: '',//should be req.body...?
            audio: '',//should be req.body.audio
            caregiverId: caregiver.get('id'),
            patientId: caregiver.get('patientId'),
            personId: createdPerson.personId
          })
          .then(face => {
            const sendFace = (photoUrl) {
              return new Promise(resolve, reject) => {
                request.post({
                  headers: microsoftHeaders,
                  url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons/${createdPerson.personId}`,
                  body: JSON.stringify({"url": photoUrl})
                }, (err, response, body) => {
                  if (err) {
                    console.log(err);
                  }
                  resolve(body);
                });
              }
            }
            let promisifiedSendFaces = urlArray.map(sendFace);
            Promise.all(promisifiedSendFaces)
            .then((results) => {
              console.log(results);
              urlArray.forEach(url => {
                db.FacePhoto.create({
                  photo: url,
                  faceId: face.get('id')
                })
              })
              res.status(201).send('Person and faces added');
            });
          });
        });
      });
    })

  },
  retrieveFaces: (req, res) => {
    let caregiverId = 1; //should be req.body.caregiverId
    db.Face.findAll({
      where: {
        caregiverId: caregiverId
      }
    })
    .then((faces) => {
      const findFace = (face) {
        return new Promise(resolve, reject) => {
          db.FacePhoto.findAll({
            where: {
              faceId: face.id
            }
          })
          .then(facePhotos => {
            const faceObj = {
              dbId: face.id,
              name: face.name, 
              description: face.description,
              photo: face.photo,
              audio: face.audio,
              photos: facePhotos
            }
            resolve(faceObj);
          });
        }
      }
      let promisifiedFindFaces = faces.map(findFace);
      Promise.all(promisifiedFindFaces)
      .then(faceObjArray => {
        res.status(200).send(JSON.stringify(faceObjArray));
      })
    });
  },
  addReminder: (req, res) => {
    let caregiverId = 1; //should be req.body.caregiverId
    db.Caregiver.findOne({
      where: {
        id: caregiverId
      }
    })
    .then(caregiver => {
      db.Reminder.create({
        date: '2016-12-10T13:00', //should be req.body.date
        type: 'medication', //should be req.body.type
        note: 'Take 2 Aleve pills (blue pill with A logo)', //req.body.note
        recurring: true, //req.body.recurring
        caregiverId: caregiverId,
        patientId: caregiver.get('patientId')
      })
      .then(reminder => {
        res.status(201).send('Successfully added reminder');
      });
    });
  },
  retrieveReminders: (req, res) => {
    let caregiverId = 1; //should be req.body.caregiverId
    db.Reminder.findAll({
      where: {
        caregiverId: caregiverId
      }
    })
    .then((reminders) => {
      res.status(200).send(JSON.stringify(reminders));
    });
  }
}