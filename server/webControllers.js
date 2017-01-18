const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const request = require('request');
const urlModule = require('url')

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

// const handleCloudinaryUrls = function(urlArray) {
//   var newCloudinaryUrlArray = [];
//   for (var i = 0; i < urlArray.length; i++) {
//     var newUrl = urlArray[i].slice(0, 49) + 'w_640,h_450,c_fill,g_face/' + urlArray[i].slice(49);
//     newCloudinaryUrlArray.push(newUrl);
//   }
//   return newCloudinaryUrlArray;
// }

//Helper function to upload photos to cloudinary
const handleFaceForm = function(req, cb) {
  const faceForm = new multiparty.Form();
  faceForm.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    const urlArray = [];
    console.log('fields in face form', fields);
    console.log('files in face form', files);
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
              cb(null, result.url, fields);        
          });
        });
      }
    } else { //if there are no files sent
      cb(null, null, fields);
    }
  });
};

const handleDetect = function(req, cb) {
  const detectForm = new multiparty.Form();
  detectForm.parse(req, function(err, fields, files) {
    console.log('files in detect', files);
    console.log('fields in detect', fields);
    if (err) {
      console.log(err);
    }
    const detectArr = [];
    var count= 0;
    if (files.detectPhoto) { //if there are photo files
      files.detectPhoto.forEach(function(photo, index) {
        cloudinary.uploader.upload(photo.path, function(result) { 
          detectArr[index] = result.url
          count++;
          if (count === files.detectPhoto.length) {
            cb(detectArr, fields);
          }
        });
      })
    }
  });
}

const handleSetupForm = function(req, cb) {
  const setupForm = new multiparty.Form();
  setupForm.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    const patientPhotoArray = [];
    console.log('files in setup', files);
    console.log('fields in setup', fields);
    if (Object.keys(files).length > 0) {
      files.patientPhoto.forEach(function(file) {
        cloudinary.uploader.upload(file.path, function(result) { 
          patientPhotoArray.push(result.url);
          if (patientPhotoArray.length === files.patientPhoto.length) {
            cb(patientPhotoArray, fields);
          }
        });
      });
    }
  })
}

const handleReminderForm = function(req, cb) {
  const reminderForm = new multiparty.Form();
  reminderForm.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    const urlArray = [];
    if (Object.keys(files).length > 0) {
      files.file.forEach(function(file) {
        cloudinary.v2.uploader.upload(file.path,
          { resource_type: 'raw' },
          function(error, result) {
            if (error) {
              console.log(error);
            }
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
    handleFaceForm(req, (urlArray, audioUrl, fields) => {
      console.log(urlArray, audioUrl);
      let personGroupId = req.user.personGroupID;
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
          photo: urlArray[0],
          audio: audioUrl,
          caregiverId: req.user.id,
          patientId: req.user.patientId,
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
  },
  updateFace: (req, res) => {
    console.log('hit updateFace')
    handleFaceForm(req, (urlArray, audioUrl, fields) => {
      console.log(urlArray);
      let faceId = fields.faceId[0];
      let personGroupId = req.user.personGroupID;
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
          var result = [];
          if (urlArray) {
            urlArray.forEach(url => {
              request.post({
                headers: microsoftHeaders,
                url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons/${face.personId}/persistedFaces`,
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
                        res.status(201).send('Person and face successfully updated, train API call made');
                      });
                    }
                  });
              });
            });
          } else {
            res.status(201).send('Person updated');
          }
        });
      });
    });
  },
  retrieveFaces: (req, res) => {
    db.Face.findAll({
      where: {
        caregiverId: req.user.id
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
  deleteFace: (req, res) => {
    console.log(req.body);
    let faceId = req.body.faceId;
    db.Face.findOne({
      where: {
        id: faceId
      }
    })
    .then(face => {
      let personId = face.get('personId');
      let personGroupId = req.user.personGroupID;
      request.delete({
          headers: microsoftHeaders,
          url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/persons/${personId}`
        }, (err, response, body) => {
          console.log('delete from mic', response);
          request.post({
            headers: microsoftHeaders,
            url: `https://api.projectoxford.ai/face/v1.0/persongroups/${personGroupId}/train`,
          }, (err, response, body) => {
            if (err) {
              console.log(err);
            }
            console.log('trained person group call made');
            db.FacePhoto.destroy({
              where: {
                faceId: faceId
              }
            })
            .then( (resp) => {
              console.log('facephoto destroy', resp)
              db.Face.destroy({
                where: {
                  id: faceId
                }
              })
              .then( (resp) => {
                console.log('face destroy', resp);
                res.status(200).send('face and facephotos deleted');
              });
            })
          });
        }
      );
    })
  },
  detectFaces: (req, res) => {
    handleDetect(req, (detectArr, fields) => {
      console.log('in detect faces controller', detectArr);
      var newCloudinaryUrlArray = [];
      for (var i = 0; i < detectArr.length; i++) {
        var newUrl = detectArr[i].slice(0, 49) + `a_auto_right/` + detectArr[i].slice(49);
        newCloudinaryUrlArray.push(newUrl);
      }
      const detectParams = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
      }
      var resultArr = [];
      var count = 0;
      newCloudinaryUrlArray.forEach(function(detectUrl, index) {
        const bodyForDetection = { "url": detectUrl}; 
        request.post({
          headers: microsoftHeaders, 
          url: "https://api.projectoxford.ai/face/v1.0/detect",
          qs: detectParams,
          body: JSON.stringify(bodyForDetection)
        }, function(err, response, body) {
          if (err) {
            console.log(err);
          }
          var parsedData = JSON.parse(body);
          if (parsedData.length === 0) {
            resultArr[index] = [null];
          } else if (parsedData.length === 1) {
            resultArr[index] = [true];

            if (fields.faceId) {
              return new Promise((resolve, reject) => {
                var faceId = fields.faceId[0];
                db.Face.findOne({
                  where: {
                    id: Number(faceId)
                  }
                })
                .then(face => {
                  var bodyForIdentification = {    
                    "personGroupId": req.user.personGroupID, 
                    "faceIds":[
                        parsedData[0].faceId
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
                    var parsedIdentifyBody = JSON.parse(body);
                    console.log('identify results', parsedIdentifyBody[0].candidates)
                    if (parsedIdentifyBody[0].candidates.length === 0) {
                      resolve("not_found");
                    } else if (parsedIdentifyBody[0].candidates.length === 1) {
                      if (parsedIdentifyBody[0].candidates[0].personId === face.get('personId')) {
                        resolve("found_match");
                      } else {
                        resolve("found_no_match")
                      }
                    } else if (parsedIdentifyBody[0].candidates.length > 1) {
                      resolve("multiple_candidates");
                    }
                  });        
                })
              })
              .then(result => {
                resultArr[index].push(result);
                count++;
                if (count === detectArr.length) {
                  res.status(200).send(JSON.stringify(resultArr));
                }
              });
            }
          } else if (parsedData.length > 1) {
            resultArr[index] = [false];
          }
          count++;
          if (count === detectArr.length) {
            res.status(200).send(JSON.stringify(resultArr));
          }
        });        
      });

    });
  },
  addReminder: (req, res) => {
    handleReminderForm(req, (audioUrl, fields) => {
      db.Reminder.create({ 
        date: fields.date[0],
        type: fields.type[0],
        note: fields.note[0],
        recurring: fields.recurring[0], 
        caregiverId: req.user.id,
        audio: audioUrl,
        title: fields.title[0],
        registered: false,
        patientId: req.user.patientId
      })
        .then(reminder => {
          console.log('res', reminder)
          res.status(201).send(JSON.stringify(reminder));
        })
        .then(() => {
          db.Patient.findOne({
            where: {
              id: req.user.patientId
            }
        })
        .then(patient => {
          console.log('patient', patient)
          sdk.sendPushNotificationAsync({
            exponentPushToken: patient.token, // The push token for the app user you want to send the notification to 
            message: "New Reminder Added"
          });
        })
      })
    });
  },
  retrieveReminders: (req, res) => {
    db.Reminder.findAll({
      where: {
        caregiverId: req.user.id,
        registered: {$ne: null}
      }, 
      order: [['date']]
    })
    .then(reminders => {
      res.status(200).send(JSON.stringify({reminders: reminders}));
    });
  },
  updateReminder: (req, res) => { 
    handleReminderForm(req, (audioUrl, fields) => {
      let reminderId = fields.reminderId[0];
      let updateObj = { 
        date: fields.date[0],
        type: fields.type[0],
        note: fields.note[0],
        registered: false,
        title: fields.title[0],
        recurring: fields.recurring[0],
        recurringDays: fields.recurringDays[0]
      }
      if(audioUrl || fields.audio) {
        updateObj.audio = fields.audio[0]
      }
      db.Reminder.update(updateObj, {
        where: {
          id: reminderId
        }
      })
      .then(reminder => {
        db.Patient.findOne({
          where: {
            id: reminder.patientId
          }
        })
        .then(patient => {
          sdk.sendPushNotificationAsync({
            exponentPushToken: patient.token, // The push token for the app user you want to send the notification to 
            message: "New Reminder Added"
          });
        })
      })
      .then(updatedReminder => {
        res.status(200).send(JSON.stringify(updatedReminder));
      });
    })
  },

  deleteReminder: (req, res) => {
    let reminderId = req.body.reminderId;
    db.Reminder.update({registered: null}, { where: {id: reminderId}})
    .then(updatedReminder => {
      res.status(200).send('updated reminder to delete in mobile');
    });
  },
  setup: (req, res) => {
    let newPersonGroupId = `ecstatic-eels-2-${req.user.id}` //why is this not working
    let patientGroupId = `ecstatic-eels-patients-1` //we don't need to change this much
    handleSetupForm(req, (patientPhotoArray, fields) => {
      request.post({
        headers: microsoftHeaders,
        url: `https://api.projectoxford.ai/face/v1.0/persongroups/${patientGroupId}/persons`,
        body: JSON.stringify({
          "name": fields.patientName[0]
        })
      }, (err, response, body) => {
        console.log(body);
        let createdPerson = JSON.parse(body);
        db.Patient.create({
          name: fields.patientName[0],
          personGroupID: newPersonGroupId,
          personId: createdPerson.personId
        })
        .then(patient => {
          let result = [];
          patientPhotoArray.forEach(patientPhoto => {
            request.post({
              headers: microsoftHeaders,
              url: `https://api.projectoxford.ai/face/v1.0/persongroups/${patientGroupId}/persons/${createdPerson.personId}/persistedFaces`,
              body: JSON.stringify({"url": patientPhoto})
              }, (err, response, body) => {
                if (err) {
                  console.log(err);
                }
                result.push(body);
                db.PatientPhoto.create({
                  photo: patientPhoto,
                  patientId: patient.get('id')
                })
                .then(() => {
                  if (patientPhotoArray.length === result.length) {
                    request.post({
                      headers: microsoftHeaders,
                      url: `https://api.projectoxford.ai/face/v1.0/persongroups/${patientGroupId}/train`,
                    }, (err, response, body) => {
                      if (err) {
                        console.log(err);
                      }
                      db.Caregiver.update(
                        {
                          patientId: patient.get('id'),
                          personGroupID: newPersonGroupId
                        }, 
                        {
                          where: {
                            id: req.user.id
                          }
                        }
                      )
                      .then(caregiver => {
                        request.put({
                          headers: microsoftHeaders,
                          url: `https://api.projectoxford.ai/face/v1.0/persongroups/${newPersonGroupId}`,
                          body: JSON.stringify({"name": newPersonGroupId})
                        }, (err, response, body) => {
                          if (err) {
                            console.log(err);
                          }
                          console.log('caregiver and patient associated');
                          res.status(201).send(JSON.stringify({patient: patient, caregiver: caregiver}));
                        })
                      });
                    });
                  }
                });
              }
            );
          });
        })
      });
    });
  }
}