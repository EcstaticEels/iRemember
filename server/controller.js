var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var baseURL = 'https://api.kairos.com';
var appId = '64bc932e';
var appKey = '1f821247a9df4a255feed4e2895fec36';


module.exports = {
  addNew: function (req, res) {
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
      'image': 'http://www.bet.com/topics/b/barack-obama/_jcr_content/image.heroimage.dimg/__1358446726593/111412-politics-barack-obama-press-conference.jpg',
      'gallery_name': 'TestGallery',
      'threshold': '0.63'
    };

    request.send(JSON.stringify(data));
  },

  find: function (req, res) {
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
      'image': 'http://media1.s-nbcnews.com/j/newscms/2014_18/418791/140504-obama-correspondents-dinner-750a_53ba5a0e11b559d8a78cdb2962b30bfd.nbcnews-ux-2880-1000.jpg',
      'subject_id': 'Barack Obama',
      'gallery_name': 'TestGallery'
    };

    request.send(JSON.stringify(data));
  }
}