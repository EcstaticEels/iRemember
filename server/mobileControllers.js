const cloudinary = require('cloudinary');
const multiparty = require('multiparty');
const request = require('request');
const urlModule = require('url');

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

const uploadPhoto = function(req, cb) {
  const form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    if (err) {
      console.log(err);
    }
    const urlArray = [];
    console.log('files', files);
    console.log('fields', fields)
    files.file.forEach(function(file) {
      cloudinary.uploader.upload(file.path, function(result) { 
        urlArray.push(result.url);
        if (urlArray.length === files.file.length) {
          cb(urlArray, fields);
        }
      });
    });
  });
};

module.exports = {
  identifyFace : function(req, res) {
    uploadPhoto(req, function(urlArray) { 
      const headers = {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "f7badff0a4484fd5ab960d007d281e75"};
      const detectParams = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
      };
      const bodyForDetection = { "url": urlArray[0]}; //only one url in the urlArray
      request.post({
        headers: headers, 
        url: "https://api.projectoxford.ai/face/v1.0/detect",
        qs: detectParams,
        body: JSON.stringify(bodyForDetection)
      }, function(err, response, body) {
        if (err) {
          console.log(err);
        }
        const parsedDetectBody = JSON.parse(body);
        console.log(parsedDetectBody);
        if (parsedDetectBody.length === 1) { //if faces are detected...what if multiple faces? need note
          //saying training photos can only have one face in frame

          //query database for the name of the person group
          var bodyForIdentification = {    
            "personGroupId":"ecstatic-eels", 
            "faceIds":[
                parsedDetectBody[0].faceId
            ]
          };
          request.post({
            headers: headers,
            url: "https://api.projectoxford.ai/face/v1.0/identify",
            body: JSON.stringify(bodyForIdentification)
          }, function(err, response, body) {
            if (err) {
              console.log(err);
            }
            const parsedIdentifyBody = JSON.parse(body);
            console.log(parsedIdentifyBody);
            if (parsedIdentifyBody.length === 0) {
              res.status(200).end("We couldn't find this person in the database...")
            } else if (parsedIdentifyBody === 1) {
              //query database for the personId received
              //send response with the person's name and information
              res.status(200).send(body);
            } else {
              //if more than one candidate, we can send suggestions of who this person is
              //or just tell them to take another photo with suggestions
            }
          });
        } else { //no faces detected in the photo
          res.status(200).end('Please take a new photo with the following suggestions...')
        }
      });
    });
  },
  retrieveReminders: function(req, res) {
    var caregiverId = Number(urlModule.parse(req.url).query.slice(12));
    caregiverId = 1;
    db.Reminder.findAll({
      where: {
        caregiverId: caregiverId
      }
    })
    .then(reminders => {
      console.log(reminders.dataValues)
      res.status(200).send(JSON.stringify({reminders: reminders}));
    });
  }
}