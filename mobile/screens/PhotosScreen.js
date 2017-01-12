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

import baseUrl from '../ip.js';

export default class PhotosScreen extends React.Component {

  constructor (props) {
    super (props);
    this._goToPersonInfoPage.bind(this);
  }

  static route = {
    navigationBar: {
      visible: false
    },
  }

  takePhoto () {
    Exponent.ImagePicker.launchCameraAsync()
    .then((photo) => {
      if (photo.cancelled) {
        this.props.navigation.performAction(({ tabs }) => {
          tabs('main').jumpToTab('home');
        })
      } else {
        uploadImageAsync(photo.uri)
        .then((response) => {
          return response.json().then(responseJSON => {
            console.log(responseJSON)
            if(responseJSON.message === 'No faces detected') {
              this._goToNoFacesFoundPage()
            }
            else if (responseJSON.message === 'Multiple faces detected') {
              this._goToMultipleFacesFoundPage()
            }
            else if (responseJSON.message === 'Failed DB lookup') {
              this._goToFailedFaceLookupPage()
            } else {
              this._goToPersonInfoPage(responseJSON);
            }
          })
        });
      }
    })
  }

  _goToPersonInfoPage = (person) => {
    this.props.navigator.push(Router.getRoute('person', {person: person}))
  }

  _goToFailedFaceLookupPage () {
    this.props.navigator.push(Router.getRoute('failedFaceLookup'))    
  }

   _goToNoFacesFoundPage () {
    this.props.navigator.push(Router.getRoute('noFaceFound'))    
  }

  _goToMultipleFacesFoundPage () {
    this.props.navigator.push(Router.getRoute('multipleFacesFound'))    
  }


  render() {
    console.log(this.props.route.params.state)
    this.takePhoto()
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
  let date = Date.now();
  let patientId = 1;
  let apiUrl = `${baseUrl}/mobile/identify?date=${date}&patientId=${patientId}`;

  let uriParts = uri.split('.');
  let fileType = uriParts[uri.length - 1];

  let formData = new FormData();
  formData.append('picture', {
    uri: uri,
    name: date + '.jpeg',
    type: 'image/jpeg',
    patientId: this.props.route.params.id,
    patientName: this.props.route.params.name
  });

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
    }
  };

  return fetch(apiUrl, options);
}
