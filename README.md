# iRemember
Assistive technology for patients with early stage Alzheimers

## Table of contents
* [Getting started](#getting-started)
  1. [Installation](#installation)
  2. [Setup environment variables](#setup-environment-variables)
  3. [Setup ip.js file](#setup-ip.js-file)
  4. [Setup MySQL database](#setup-mysql-database)
  5. [Build & Start](#build&start)
* [Requirements](#requirements)
* [Documentation](#documentation)
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

## Requirements

- Node
- MySQL
- Xcode
- Exponent

##Screenshots
[Web Client] Home and Login Screen
![Web Client Home]
(https://image.ibb.co/dEKE5a/web_client_home.png)

[Web Client] Reminder List
![Web Client Reminders]
(https://image.ibb.co/jFRu5a/web_client_post_reminderadd.png)

[Web Client] Face Profiles for Face Recognition
![Web Client Face Recognition]
(https://image.ibb.co/f67Z5a/web_client_post_faceadd.png)

[Web Client] Face Detection Component
![Web Client Face Detection]
(https://image.ibb.co/kkWSQa/web_client_detect_faces.png)

[Mobile Client] Login Screen
![Mobile Client Login Screen]
(https://image.ibb.co/byfAdv/IMG_4859.png)

[Mobile Client] Home Screen
![Mobile Client Home Screen]
(https://image.ibb.co/d7JwJv/IMG_4863.png)

[Mobile Client] Reminder Screen
![Mobile Client Reminder Screen]
(https://image.ibb.co/dMBGJv/IMG_4865.png)

[Mobile Client] Face Lookup Success Screen
![Mobile Client Face Lookup Success]
(https://image.ibb.co/iBE3yv/IMG_4872.png)

[Mobile Client] Failed Face Lookup Screen
![Mobile Client Failed Face Lookup]
(https://image.ibb.co/jrR5BF/IMG_4870.png)

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

