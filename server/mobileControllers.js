module.exports = {
  identifyFace : function(req, res) {
    console.log('identifying Face');
  },
  retrieveReminders: function(req, res) {
    console.log('retrieving Reminders', req);
    res.send('yay!');
  }
}