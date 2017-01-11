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

export default createRouter(() => ({
  login: () => LoginScreen,
  home: () => HomeScreen,
  reminders: () => RemindersScreen,
  photos: () => PhotosScreen,
  rootNavigation: () => RootNavigation,
  reminder: () => ReminderInfoScreen,
  person: () => PersonInfoScreen,  
}));
