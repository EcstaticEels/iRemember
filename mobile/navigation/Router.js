import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import RemindersScreen from '../screens/RemindersScreen';
import PhotosScreen from '../screens/PhotosScreen';
import RootNavigation from './RootNavigation';
import ReminderInfoScreen from '../screens/ReminderInfoScreen';
import PersonInfoScreen from '../screens/PersonInfoScreen';
import LoginScreen from '../screens/LoginScreen';
import FailedFaceLoginScreen from '../screens/FailedFaceLoginScreen';
import FailedNameLoginScreen from '../screens/FailedNameLoginScreen';
import FailedFaceLookupScreen from '../screens/FailedFaceLookupScreen';
import NoFaceFoundScreen from '../screens/NoFaceFoundScreen';
import MultipleFacesFoundScreen from '../screens/MultipleFacesFoundScreen';

export default createRouter(() => ({
  failedNameLogin: () => FailedNameLoginScreen,
  failedFaceLogin: () => FailedFaceLoginScreen,
  login: () => LoginScreen,
  home: () => HomeScreen,
  reminders: () => RemindersScreen,
  photos: () => PhotosScreen,
  rootNavigation: () => RootNavigation,
  reminder: () => ReminderInfoScreen,
  person: () => PersonInfoScreen,
  failedFaceLookup: () => FailedFaceLookupScreen,
  noFaceFound: () => NoFaceFoundScreen,
  multipleFacesFound: () => MultipleFacesFoundScreen,
}));
