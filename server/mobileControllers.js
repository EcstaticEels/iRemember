const cloudinary = require('cloudinary');
const request = require('request');
const urlModule = require('url');
var fs = require('fs');

const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-west-1",
});

const db = require('../database/db.js');
const sdk = require('exponent-server-sdk');

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

module.exports = {
  identifyFace : function(req, res) {
    // console.log('file coming in from mobile', req.file);
    const qParams = urlModule.parse(req.url).query.split('&');
    const date = qParams[0].slice(5);
    const patientId = qParams[1].slice(10);
    console.log('name of file', date, 'patientid ', patientId);
    db.Caregiver.findOne({
      where: {
        id: Number(patientId)
      }
    })
    .then(caregiver => {
      console.log('THIS IS THE CAREGIVER', caregiver)
      const detectParams = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
      }
      const bodyForDetection = { "url": `https://s3-us-west-1.amazonaws.com/hackreactorphoto/${date}.jpeg`}; //only one url in the urlArray
      request.post({
        headers: microsoftHeaders, 
        url: "https://api.projectoxford.ai/face/v1.0/detect",
        qs: detectParams,
        body: JSON.stringify(bodyForDetection)
      }, function(err, response, body) {
        if (err) {
          console.log(err);
        }
        const parsedDetectBody = JSON.parse(body);
        console.log('detection results', parsedDetectBody);
        const personGroupId = caregiver.get('personGroupID');
        if (parsedDetectBody.length === 1) { 
          var bodyForIdentification = {    
            "personGroupId": personGroupId, 
            "faceIds":[
                parsedDetectBody[0].faceId
            ]
          };
          request.post({
            headers: microsoftHeaders,
            url: "https://api.projectoxford.ai/face/v1.0/identify",
            body: JSON.stringify(bodyForIdentification)
          }, function(err, response, body) {
            if (err) {
              console.log(err);
            }
            console.log('identification results', body)
            const parsedIdentifyBody = JSON.parse(body);
            if (parsedIdentifyBody[0].candidates.length === 0) {
              res.status(404).send({message: 'Failed DB lookup'})
            } else if (parsedIdentifyBody[0].candidates.length === 1) {
              console.log('we found this person', parsedIdentifyBody[0].candidates);
              db.Face.findOne({
                where: {
                  personId: parsedIdentifyBody[0].candidates[0].personId
                }
              })
              .then((person) => {
                if (person !== null) {
                  console.log('about to send this to mobile', JSON.stringify(person));
                  res.status(200).send(JSON.stringify(person));
                } else {
                  console.log('IS THIS NULL??', person)
                  res.status(404).send({message: 'Failed DB lookup'})
                }
              })
            } else {
              console.log('we found more than one candidate');
              const findIdentifiedFaces = personId => {
                return new Promise( (resolve, reject) => {
                  db.Face.findAll({
                    where: {
                      personId: personId
                    }
                  })
                  .then(identifiedPerson => {
                    const identifiedPersonObj = {
                      dbId: identifiedPerson.id,
                      name: identifiedPerson.name,
                      description: identifiedPerson.description,
                      photo: identifiedPerson.photo,
                      audio: identifiedPerson.audio
                    }
                    resolve(identifiedPersonObj);
                  });
                });
              }
              let promisifiedFindIdentified = parsedIdentifyBody[0].candidates.map(findIdentifiedFaces);
              Promise.all(promisifiedFindIdentified)
              .then(identifiedObjArray => {
                res.status(200).send(JSON.stringify({identifiedFaces: identifiedObjArray}));
              });
            }
          });
        } else if (parsedDetectBody.length > 1) { //multiple faces detected in the photo
          console.log('HIT ELSE BLOCK')
          res.status(404).send({message: 'Multiple faces detected'})
        } else { //no faces detected in the photo
          res.status(404).send({message: 'No faces detected'})
        }
      });
    });
  },
  loginFace : function(req, res) {
    // console.log('file coming in from mobile', req.file);
    const qParams = urlModule.parse(req.url).query.split('&');
    const date = qParams[0].slice(5);
    console.log('name of file', date);
    const detectParams = {
      "returnFaceId": "true",
      "returnFaceLandmarks": "false"
    }
    const bodyForDetection = { "url": `https://s3-us-west-1.amazonaws.com/hackreactorphoto/${date}.jpeg`}; //only one url in the urlArray
    request.post({
      headers: microsoftHeaders, 
      url: "https://api.projectoxford.ai/face/v1.0/detect",
      qs: detectParams,
      body: JSON.stringify(bodyForDetection)
    }, function(err, response, body) {
      if (err) {
        console.log(err);
      }
      const parsedDetectBody = JSON.parse(body);
      console.log('detection results', parsedDetectBody);
      const personGroupId = 'ecstatic-eels-patients-3' //CHANGE TO PATIENT
      if (parsedDetectBody.length === 1) { 
        var bodyForIdentification = {    
          "personGroupId": personGroupId, 
          "faceIds":[
              parsedDetectBody[0].faceId
          ]
        };
        request.post({
          headers: microsoftHeaders,
          url: "https://api.projectoxford.ai/face/v1.0/identify",
          body: JSON.stringify(bodyForIdentification)
        }, function(err, response, body) {
          if (err) {
            console.log(err);
          }
          console.log('identification results', body)
          const parsedIdentifyBody = JSON.parse(body);
          if (parsedIdentifyBody[0].candidates.length === 0) {
            res.status(200).end("We couldn't find this person in the database...")
          } else if (parsedIdentifyBody[0].candidates.length === 1) {
            console.log('we found this person', parsedIdentifyBody[0].candidates);
            db.Patient.findOne({
              where: {
                personId: parsedIdentifyBody[0].candidates[0].personId
              }
            })
            .then(person => {
              console.log('about to send this to mobile', JSON.stringify(person));
              res.status(200).send(JSON.stringify(person));
            })
          } else {
            console.log('we found more than one candidate');
            const findIdentifiedFaces = personId => {
              return new Promise( (resolve, reject) => {
                db.Face.findAll({
                  where: {
                    personId: personId
                  }
                })
                .then(identifiedPerson => {
                  const identifiedPersonObj = {
                    dbId: identifiedPerson.id,
                    name: identifiedPerson.name,
                    description: identifiedPerson.description,
                    photo: identifiedPerson.photo,
                    audio: identifiedPerson.audio
                  }
                  resolve(identifiedPersonObj);
                });
              });
            }
            let promisifiedFindIdentified = parsedIdentifyBody[0].candidates.map(findIdentifiedFaces);
            Promise.all(promisifiedFindIdentified)
            .then(identifiedObjArray => {
              res.status(200).send(JSON.stringify({identifiedFaces: identifiedObjArray}));
            });
          }
        });
      } else { //no faces detected in the photo
          console.log('HIT ELSE BLOCK')
          res.sendStatus(404)      }
    });
  },

  retrieveReminders: function(req, res) {
    var patientId = Number(urlModule.parse(req.url).query.slice(10));
    patientId = 1;
    db.Reminder.findAll({
      where: {
        patientId: patientId
        // date: {$gte: new Date().toLocaleDateString()}
      }
    })
    .then(reminders => {
      res.status(200).send(JSON.stringify({reminders: reminders}));
    });
  },
  updateReminders: (req, res) => {
    console.log('body', req.body)
    req.body.forEach((reminder) => {
      console.log(reminder.notificationId.join(','))
      // console.log('updating reminder', reminder)
      db.Reminder.update(
        { 
          registered: reminder.registered,
          notificationId: reminder.notificationId.join(',')
        },
        { where: { id: reminder.id}}
      )
    })
    res.status(200).send('database updated')
  },
  deleteReminders: (req, res) => {
    console.log(req.body)
    let reminderIds = req.body.id;
    db.Reminder.destroy({ where: {id: reminderIds}})
    .then(updatedReminder => {
      res.status(200).send('deleted');
    });
  },
  addToken: (req, res) => {
    db.Patient.update({token: req.body.token},{ where: { id: req.body.id}})
    .then(() => {
      res.status(200).send('Token added!');
    })
  },
  // addPushNotification: function(req, res) {
  //   let isPushToken = sdk.isExponentPushToken(req.body.token);
 
  //   // To send a push notification 
  //   // (async function () {
  //   sdk.sendPushNotificationAsync({
  //     exponentPushToken: req.body.token, // The push token for the app user you want to send the notification to 
  //     message: "Reminders updated"
  //   });
  //   // })();
  //   res.send('got it')
  // }
}