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
* [Read the docs](http://iremember.co) to learn about the components and how to get a prototype on your phone
* [DEMO](http://demo.iremember.co/)

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
| [MySQL] (https://github.com/mysqljs/mysql) | MYSQL_USERNAME, MYSQL_PASSWORD  |
| [Amazon Web Service] (https://aws.amazon.com/start-now/) | AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET  |
| [Cloudinary] (http://cloudinary.com/) | CLOUDINARY_API_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET |
| [Microsoft Cognitive Services] (https://www.microsoft.com/cognitive-services/en-us/face-api) | MICROSOFT_API_KEY, MICROSOFT_PATIENTS_GROUP_ID, MICROSOFT_PERSON_GROUP_ID  |
| [Google API Client] (https://developers.google.com/api-client-library/javascript/start/start-js) | GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET |


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

## Documentation

## Team

| Name        | Github           | LinkedIn  |
| ------------- |:-------------:| -----:|
| **Jennifer Kao**      | https://github.com/ | https://www.linkedin.com/in/ |
| **Ethan Harry**      | https://github.com/     | https://www.linkedin.com/in/ |
| **Lisa Nam** | https://github.com/lisanam      |   https://www.linkedin.com/in/lisanam-js  |

## Contributing

If you see an error or a place where content should be updated or improved, just fork this repository to your github account, make the change you'd like and then submit a pull request. If you're not able to make the change, file an [issue](https://github.com/EcstaticEels/iRemember/issues/new).

## License

`iRemember` is licensed under the [MIT License](http://opensource.org/licenses/MIT).

