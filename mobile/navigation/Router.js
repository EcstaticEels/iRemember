import {
  createRouter,
} from '@exponent/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import RemindersScreen from '../screens/RemindersScreen';
import PhotosScreen from '../screens/PhotosScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  home: () => HomeScreen,
  reminders: () => RemindersScreen,
  photos: () => PhotosScreen,
  rootNavigation: () => RootNavigation,
}));
