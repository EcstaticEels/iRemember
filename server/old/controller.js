var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var baseURL = 'https://api.kairos.com';
var appId = '64bc932e';
var appKey = '1f821247a9df4a255feed4e2895fec36';


module.exports = {
  add: function (req, res) {
    var gallery = req.body.patient;
    var subject = req.body.subject;
    var photo = req.body.photo;

    var request = new XMLHttpRequest();
    request.open('POST', baseURL + '/enroll');

    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('app_id', appId);
    request.setRequestHeader('app_key', appKey);

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log('Status:', this.status);
        console.log('Headers:', this.getAllResponseHeaders());
        console.log('Body:', this.responseText);
      }
    };

    var data = {
      'gallery_name': gallery,
      'subject_id': subject,
      'image': photo
    };

    request.send(JSON.stringify(data));
    res.end();
  },

  find: function (req, res) {
    var gallery = req.body.patient;
    var photo = req.body.photo;

    var request = new XMLHttpRequest();

    request.open('POST', 'https://api.kairos.com/recognize');

    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('app_id', appId);
    request.setRequestHeader('app_key', appKey);

    request.onreadystatechange = function () {
      if (this.readyState === 4) {
        console.log('Status:', this.status);
        console.log('Headers:', this.getAllResponseHeaders());
        console.log('Body:', this.responseText);
      }
    };

    var data = {
      'image': photo,
      'gallery_name': gallery,
      'max_num_results': 3,
      'threshold': '0.63'
    };

    request.send(JSON.stringify(data));
    res.end();
  }
}