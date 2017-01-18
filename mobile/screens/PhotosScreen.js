import React from 'react';

import {
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import {
  ExponentConfigView,
} from '@exponent/samples';

import Exponent, {ImagePicker} from 'exponent';

import Router from '../navigation/Router.js';

import baseUrl from '../ip.js';

export default class PhotosScreen extends React.Component {

  constructor (props) {
    super (props);
    this._goToPersonInfoPage.bind(this);

    this.state = {
      loading: false
    }
  }

  static route = {
    navigationBar: {
      visible: false
    },
  }

  componentDidMount () {
    this.takePhoto()
  }

  takePhoto () {
    ImagePicker.launchCameraAsync()
    .then((photo) => {
      if (photo.cancelled === true) {
        this.props.navigation.performAction(({ tabs }) => {
          tabs('main').jumpToTab('home');
        })
      } else {
        this.setState({loading: true})
        this.uploadImageAsync(photo.uri)
        .then((response) => {
          return response.json().then(responseJSON => {
            this.setState({loading: false})
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

uploadImageAsync(uri) {
  let date = Date.now();
  let patientId = this.props.route.params.state.id;

  let apiUrl = `${baseUrl}/mobile/identify?date=${date}&patientId=${patientId}`;

  let uriParts = uri.split('.');
  let fileType = uriParts[uri.length - 1];

  let formData = new FormData();
  formData.append('picture', {
    uri: uri,
    name: date + '.jpeg',
    type: 'image/jpeg',
    // patientId: this.props.route.params.id,
    // patientName: this.props.route.params.name
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


  render() {

    // this.takePhoto()

    if (this.state.loading) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <ActivityIndicator size='large' />
        </ScrollView>
      );
    } else {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={this.props.route.getContentContainerStyle()}>
        </ScrollView>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50'
  },
  ActivityIndicator: {
    alignSelf: 'center'
  },
  contentContainer: {
    paddingTop: 40,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-around',
    flex: 1
  },
});