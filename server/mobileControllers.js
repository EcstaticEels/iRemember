const cloudinary = require('cloudinary');
// const multiparty = require('multiparty');
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

// puts file into req.files.file

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

module.exports = {
  identifyFace : function(req, res) {
      const headers = {"Content-Type": "application/json", "Ocp-Apim-Subscription-Key": "f7badff0a4484fd5ab960d007d281e75"};
      const detectParams = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
      }
      const bodyForDetection = { "url": 'https://s3-us-west-1.amazonaws.com/hackreactorphoto/picture.jpeg'}; //only one url in the urlArray
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
        // console.log(parsedDetectBody);
        if (parsedDetectBody.length === 1) { //if faces are detected...what if multiple faces? need note
          //saying training photos can only have one face in frame

          //query database for the name of the person group
          console.log(parsedDetectBody)
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
            // console.log(parsedIdentifyBody);
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