const express = require('express');
const webRemindersRouter = express.Router();
const webRemindersControllers = require('./controllers/webRemindersControllers.js');

//Middleware function to ensure authentication to protected routes
const ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  }
  res.status(401).send('You are not logged in'); 
}

webRemindersRouter.use(ensureAuthenticated);

webRemindersRouter.route('/')
  .post(webRemindersControllers.addReminder)
  .get(webRemindersControllers.retrieveReminders)
  .put(webRemindersControllers.updateReminder)
  .delete(webRemindersControllers.deleteReminder)

module.exports = webRemindersRouter;