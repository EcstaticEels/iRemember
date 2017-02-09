# iRemember
Assistive technology for patients with early stage Alzheimers

## Table of contents
* [Getting started](#getting-started)
  1. [Installation](#installation)
  2. [Setup environment variables](#setup-environment-variables)
  3. [Setup ip.js file](#setup-ip.js-file)
  4. [Setup MySQL database](#setup-mysql-database)
  5. [Build & Start](#build&start)
* [Tech Stack](#requirements)
* [Screenshots](#screenshots)
* [Team](#team)
* [Contributing](#contributing)
* [License](#license)

## Getting started

* Clone the repo with `https://github.com/EcstaticEels/iRemember.git`

### Installation

Install `iRemember` web and mobile apps' dependencies via [npm](http://www.npmjs.com/):

```bash
$ npm install
$ cd mobile
$ npm install
```

### Setup environment variables

| Services | Variables |
| ------------- | ------------- |
| MySQL | MYSQL_USERNAME, MYSQL_PASSWORD  |
| Amazon Web Services | AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET  |
| Cloudinary | CLOUDINARY_API_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET |
| Microsoft Cognitive Services | MICROSOFT_API_KEY |
| Google API Client | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET |



| Microsoft Face API Person Groups for Face Recognition | Variables |
| ------------- | ------------- |
| Face Group ID for Microsoft Face API | FACE_GROUP_ID |
| Patient Group ID for Microsoft Face API | PATIENT_GROUP_ID |


### Setup ip.js file

modify `mobile/ip.js`:

```bash
var ipAddress = 'YOUR_SERVER_IP_ADDRESS_HERE'
var portNum = '3000'

module.exports = 'http://' + ipAddress + ":" + portNum;
```

### Setup MySQL database

```bash
$ mysql.server start
$ mysql -u YOUR_MYSQL_USERNAME -p
$ YOUR_MYSQL_PASSWORD
$ CREATE DATABASE iremember;
```

### Build & Start

Build the web components and start the server via [grunt](http://gruntjs.com/):

```bash
$ grunt build
$ grunt start-dev
```

## Tech Stack

- React
- React-Native
- Node
- Express
- MySQL
- Exponent

##Screenshots
[Web Client] Home and Login Screen
<a href="https://ibb.co/dN2CrF"><img src="https://preview.ibb.co/jm7dWF/web_client_home.png" alt="web client home" border="0" /></a>

[Web Client] Reminder List
<img src="https://image.ibb.co/jFRu5a/web_client_post_reminderadd.png" alt="web client post reminderadd" border="0" />

[Web Client] Face Profiles for Face Recognition
<img src="https://image.ibb.co/f67Z5a/web_client_post_faceadd.png" alt="web client post faceadd" border="0" />

[Web Client] Face Detection Component
<img src="https://image.ibb.co/kkWSQa/web_client_detect_faces.png" alt="web client detect faces" border="0" />

[Mobile Client] Login Screen
<img src="https://image.ibb.co/byfAdv/IMG_4859.png" alt="IMG 4859" border="0" />

[Mobile Client] Home Screen
<img src="https://image.ibb.co/d7JwJv/IMG_4863.png" alt="IMG 4863" border="0" />

[Mobile Client] Reminder Screen
<img src="https://image.ibb.co/dMBGJv/IMG_4865.png" alt="IMG 4865" border="0" />

[Mobile Client] Face Lookup Success Screen
<img src="https://image.ibb.co/iBE3yv/IMG_4872.png" alt="IMG 4872" border="0" />

[Mobile Client] Failed Face Lookup Screen
<img src="https://image.ibb.co/jrR5BF/IMG_4870.png" alt="IMG 4870" border="0" />

## Team

| Name        | Github           | LinkedIn  |
| ------------- |:-------------:| -----:|
| **Jennifer Kao**      | https://github.com/jennkao | https://www.linkedin.com/in/jenn-kao |
| **Ethan Harry**      | https://github.com/   | https://www.linkedin.com/in/ |
| **Lisa Nam** | https://github.com/lisanam      |   https://www.linkedin.com/in/lisanam-js  |

## Contributing

If you see an error or a place where content should be updated or improved, just fork this repository to your github account, make the change you'd like and then submit a pull request. If you're not able to make the change, file an [issue](https://github.com/EcstaticEels/iRemember/issues/new).

## License

`iRemember` is licensed under the [MIT License](http://opensource.org/licenses/MIT).

