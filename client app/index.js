/**
 * @format
 */
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

if (!firestore().apps || !firestore().apps.length) {
    firestore(); // Just call the firestore function
  }

AppRegistry.registerComponent(appName, () => App);
