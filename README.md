# iRemember
Assistive technology for patients with early stage Alzheimers

## Getting started

* Clone the repo with `https://github.com/EcstaticEels/iRemember.git`
* [Read the docs](http://iremember.co) to learn about the components and how to get a prototype on your phone
* [DEMO](http://demo.iremember.co/)

###Setup

`iRemember`can be built via [npm](http://www.npmjs.com/) and [grunt](http://gruntjs.com/):

```bash
$ npm install
$ grunt build
$ grunt start-dev
```

#### Setup environment variables

| Service | Variables |
| ------------- | ------------- |
| MySQL | MYSQL_USERNAME, MYSQL_PASSWORD  |
| [Amazon Web Service] (https://aws.amazon.com/start-now/) | AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET  |
| [Cloudinary] (http://cloudinary.com/) | CLOUDINARY_API_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET |
| [Microsoft Cognitive Services] (https://www.microsoft.com/cognitive-services/en-us/face-api) | MICROSOFT_API_KEY  |
| [Google API Client] (https://developers.google.com/api-client-library/javascript/start/start-js) | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET |


#### Setup ip.js file

modify `mobile/ip.js`:

```bash
var ipAddress = 'YOUR_SERVER_IP_ADDRESS_HERE'
var portNum = '3000'

module.exports = 'http://' + ipAddress + ":" + portNum;
```

#### Setup the database

```bash
$ mysql.server start
$ mysql -u YOUR_MYSQL_USERNAME -p
$ YOUR_MYSQL_PASSWORD
```



