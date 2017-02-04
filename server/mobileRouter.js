const express = require('express');
const mobileRouter = express.Router();
const mobileControllers = require('./controllers/mobileControllers.js');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

//Amazon S3 uploader middleware
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
      cb(null, file.originalname);
    }
  })
});

mobileRouter.post('/login', upload.single('picture'), mobileControllers.loginFace);
mobileRouter.post('/faces', upload.single('picture'), mobileControllers.identifyFace);
mobileRouter.route('/reminders')
  .get(mobileControllers.retrieveReminders)
  .put(mobileControllers.updateReminders)
  .delete(mobileControllers.deleteReminders)
mobileRouter.post('/notifications', mobileControllers.addToken);

module.exports = mobileRouter;