const express = require('express');
const webFaceRouter = express.Router();
const webFaceControllers = require('./controllers/webFaceControllers.js');

//Middleware function to ensure authentication to protected routes
const ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.status(401).send('You are not logged in'); 
}

webFaceRouter.use(ensureAuthenticated);

webFaceRouter.route('/')
  .post(webFaceControllers.addFace)
  .get(webFaceControllers.retrieveFaces)
  .put(webFaceControllers.updateFace)
  .delete(webFaceControllers.deleteFace)

webFaceRouter.post('/detect', webFaceControllers.detectFaces)

webFaceRouter.route('/patients')
  .post(webFaceControllers.setup)
  .put(webFaceControllers.updateSetup)
  .get(webFaceControllers.getPatients)

module.exports = webFaceRouter;