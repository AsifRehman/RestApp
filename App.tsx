// In App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingsScreen from './src/screens/SettingsScreen'; // Example drawer screen
import TodaySales from './src/screens/TodaySales';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator for screens that require navigation within the drawer
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TodaySales" component={TodaySales} />
    </Stack.Navigator>
  );
}

// Main App Component with Drawer
function App() {
  return (
    <NavigationContainer >
      <Drawer.Navigator initialRouteName="Login" screenOptions={{
        headerShown: false,
      }}>
        <Drawer.Screen name="Login" component={LoginScreen} options={{
          headerTitle: '',
        }} />
        <Drawer.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
