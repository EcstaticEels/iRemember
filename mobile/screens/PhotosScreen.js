import React from 'react';

var FileUpload = require('NativeModules').FileUpload;

import {
  ScrollView,
  StyleSheet,
} from 'react-native';

import {
  ExponentConfigView,
} from '@exponent/samples';

import * as Exponent from 'exponent';

import axios from 'axios';

import Router from '../navigation/Router.js';

export default class PhotosScreen extends React.Component {

  constructor (props) {
    super (props);
  }

  static route = {
    navigationBar: {
      visible: false
    },
  }

  componentDidMount () {
    Exponent.ImagePicker.launchCameraAsync()
    .then((photo) => {
      console.log(photo)
      uploadImageAsync(photo.uri)
    })
    .then((response) => {
      // console.log(response)
    })
  }

  _goToPersonInfoPage = (person) => {
    this.props.navigator.push(Router.getRoute('person', {person: person}))
  }

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={this.props.route.getContentContainerStyle()}>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

async function uploadImageAsync(uri) {
  let apiUrl = 'http://10.6.19.201:3000/mobile/identify';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  let uriParts = uri.split('.');
  let fileType = uriParts[uri.length - 1];

  let formData = new FormData();
  formData.append('picture', {
    uri: uri,
    name: 'picture.jpeg',
    type: 'image/jpeg',
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };

  console.log(formData)

  return fetch(apiUrl, options);
}
