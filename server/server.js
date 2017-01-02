//Basic server
var express = require('express');
var app = express();


//Database
var db = require('../data/db.js');

//Middleware
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

//Controller
var controller = require('./controller.js');

//Routes
var path = require('path');
app.use(express.static(path.join(__dirname, '..', 'public')))
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/webIndex.html'))
})

//Reminders

//Facial recognition
app.post('/web/face/add', controller.add);
app.post('/mobile/face/find', controller.find);

app.listen(3000, function () {
  console.log('iRemember is running on port 3000!')
});