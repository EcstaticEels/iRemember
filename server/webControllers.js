const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const request = require('request');
const urlModule = require('url')

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
  const faceForm = new multiparty.Form();
  faceForm.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    const urlArray = [];
    console.log('files', files);
    console.log('fields', fields)
    if (Object.keys(files).length > 0) { //if there are files
      if (files.photo) { //if there are photo files
        files.photo.forEach(function(file) {
          cloudinary.uploader.upload(file.path, function(result) { 
            urlArray.push(result.url);
            if (urlArray.length === files.photo.length) {
              if (files.audio) { //if there are also audio files
                files.audio.forEach(function(file) {
                  cloudinary.v2.uploader.upload(file.path,
                    { resource_type: 'raw' },
                    function(error, result) {
                      if (error) {  
                        console.log(error);
                      }
                      console.log(result); 
                      cb(urlArray, result.url, fields);        
                  });
                });
              } else { //if there are no audio files
                cb(urlArray, null, fields);
              }
            }
          });
        });
      } else if (files.audio) { //if there is only an audio file
        files.audio.forEach(function(file) {
          cloudinary.v2.uploader.upload(file.path,
            { resource_type: 'raw' },
            function(error, result) {
              if (error) {
                console.log(error);
              }
              console.log(result); 
              cb(null, result.url, fields);        
          });
        });
      }
    } else { //if there are no files sent
      cb(null, null, fields);
    }
  });
};

const uploadAudio = function(req, cb) {
  const reminderForm = new multiparty.Form();
  reminderForm.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    const urlArray = [];
    console.log('files', files);
    console.log('fields', fields);
    if (Object.keys(files).length > 0) {
      files.file.forEach(function(file) {
        cloudinary.v2.uploader.upload(file.path,
          { resource_type: 'raw' },
          function(error, result) {
            if (error) {
              console.log(error);
            }
            console.log(result); 
            cb(result.url, fields);        
        });
      });
    } else {
      cb(null, fields);
    }
  });
};

module.exports = {
  addFace: (req, res) => {
    uploadPhoto(req, (urlArray, audioUrl, fields) => {
      console.log(urlArray, audioUrl);
      db.Caregiver.findOne({
        where: {
          id: Number(fields.id[0])
        }
      })
      .then(caregiver => {
        let personGroupId = caregiver.get('personGroupID');
        request.post({
          headers: microsoftHeaders,
          url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons`,
          body: JSON.stringify({
            "name": fields.subjectName[0],
            "userData": fields.description[0] 
          })
        }, (err, response, body) => {
          if (err) {
            console.log(err);
          }
          let createdPerson = JSON.parse(body);
          db.Face.create({
            name: fields.subjectName[0], 
            description: fields.description[0], 
            photo: urlArray[0],//should be req.body...?
            audio: audioUrl,//should be req.body.audio
            caregiverId: caregiver.get('id'),
            patientId: caregiver.get('patientId'),
            personId: createdPerson.personId
          })
          .then(face => {
            var result = [];
            urlArray.forEach(url => {
              request.post({
                headers: microsoftHeaders,
                url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons/${createdPerson.personId}/persistedFaces`,
                body: JSON.stringify({"url": url})
              }, (err, response, body) => {
                if (err) {
                  console.log(err);
                }
                result.push(body);
                db.FacePhoto.create({
                  photo: url,
                  faceId: face.get('id')
                })
                .then(() => {
                  if (urlArray.length === result.length) {
                    request.post({
                      headers: microsoftHeaders,
                      url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/train`,
                    }, (err, response, body) => {
                      if (err) {
                        console.log(err);
                      }
                      res.status(201).send(JSON.stringify(face));
                    });
                  }
                });
              });
            });
          });
        });
      });
    });
  },
  updateFace: (req, res) => {
    console.log('hit updateFace')
    uploadPhoto(req, (urlArray, audioUrl, fields) => {
      console.log(urlArray);
      let faceId = fields.faceId[0];
      db.Caregiver.findOne({
        where: {
          id: Number(fields.id[0])
        }
      })
      .then(caregiver => {
        let personGroupId = caregiver.get('personGroupID');
        db.Face.findOne({
          where: {
            id: faceId
          }
        })
        .then(face => {
          let updateObj = audioUrl ? 
            { name: fields.subjectName[0],
              description: fields.description[0],
              audio: audioUrl}
            : { name: fields.subjectName[0],
              description: fields.description[0]};
          db.Face.update(
            updateObj,
            { where: {id: face.get('id')}}
          )
          .then(() => {
            if (urlArray) {
              request.post({
                headers: microsoftHeaders,
                url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons/${face.personId}/persistedFaces`,
                body: JSON.stringify({"url": urlArray[0]})
              }, (err, response, body) => {
                  if (err) {
                    console.log(err);
                  }
                  db.FacePhoto.create({
                    photo: urlArray[0],
                    faceId: face.get('id')
                  })
                  .then(() => {
                    request.post({
                      headers: microsoftHeaders,
                      url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/train`,
                    }, (err, response, body) => {
                      if (err) {
                        console.log(err);
                      }
                      res.status(201).send('Person and face successfully added, train API call made');
                    });
                  });
              });
            } else {
              res.status(201).send('Person updated');
            }
          });
        });
      });
    });
  },
  retrieveFaces: (req, res) => {
    var caregiverId = Number(urlModule.parse(req.url).query.slice(12));
    db.Face.findAll({
      where: {
        caregiverId: caregiverId
      }
    })
    .then(faces => {
      const findFace = face => {
        return new Promise( (resolve, reject) => {
          db.FacePhoto.findAll({
            where: {
              faceId: face.id
            },
            order: [['updatedAt', 'DESC']]
          })
          .then(facePhotos => {
            const faceObj = {
              dbId: face.id,
              subjectName: face.name, 
              description: face.description,
              photo: face.photo,
              audio: face.audio,
              photos: facePhotos
            }
            resolve(faceObj);
          });
        });
      }
      let promisifiedFindFaces = faces.map(findFace);
      Promise.all(promisifiedFindFaces)
      .then(faceObjArray => {
        res.status(200).send(JSON.stringify({faces: faceObjArray}));
      });
    });
  },
  addReminder: (req, res) => {
    uploadAudio(req, (audioUrl, fields) => {
      let caregiverId = Number(fields.id[0]); 
      db.Caregiver.findOne({
        where: {
          id: caregiverId
        }
      })
      .then(caregiver => {
        db.Reminder.create({ 
          date: fields.date[0],
          type: fields.type[0],
          note: fields.note[0],
          recurring: fields.recurring[0], 
          caregiverId: caregiverId,
          audio: audioUrl,
          title: fields.title[0],
          registered: false,
          patientId: caregiver.get('patientId')
        })
        .then(reminder => {
          res.status(201).send(JSON.stringify(reminder));
        });
      });
    });
  },
  retrieveReminders: (req, res) => {
    var caregiverId = Number(urlModule.parse(req.url).query.slice(12));
    db.Reminder.findAll({
      where: {
        caregiverId: caregiverId
      }, 
      order: [['date']]
    })
    .then(reminders => {
      res.status(200).send(JSON.stringify({reminders: reminders}));
    });
  },
  updateReminder: (req, res) => { 
    uploadAudio(req, (audioUrl, fields) => {
      let reminderId = fields.reminderId[0];
      let updateObj = audioUrl ? 
        { date: fields.date[0],
          type: fields.type[0],
          note: fields.note[0],
          audio: audioUrl,
          registered: false,
          title: fields.title[0],
          recurring: fields.recurring[0]}
        : { date: fields.date[0],
          type: fields.type[0],
          note: fields.note[0],
          title: fields.title[0],
          registered: false,
          recurring: fields.recurring[0]};
      db.Reminder.update(updateObj, 
        {
          where: {
            id: reminderId
          }
        }
      )
      .then(updatedReminder => {
        res.status(200).send(JSON.stringify(updatedReminder));
      });
    })
  },
  deleteReminder: (req, res) => {
    let reminderId = req.body.reminderId;
    db.Reminder.destroy({ where: {id: reminderId}})
    .then(updatedReminder => {
      res.status(200).send('deleted');
    });
  }
}