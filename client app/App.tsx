// In App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingsScreen from './src/screens/SettingsScreen'; // Example drawer screen
import TodaySales from './src/screens/TodaySales';
import SaleDetails from './src/screens/SaleDetails';
import ProfileScreen from './src/screens/ProfileScreen';
import BlueScreen from './src/screens/BlueScreen';
import SecureScreen from './src/screens/SecureScreen';
import AllProducts from './src/screens/AllProducts';
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator for screens that require navigation within the drawer
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TodaySales" component={TodaySales} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Blue" component={BlueScreen} />
      <Stack.Screen name="Sale Details" component={SaleDetails} />

      <Stack.Screen 
      name="SaleDetails" 
      component={SaleDetails} 
      initialParams={{ vocNo: '1' }} // Provide a default value for vocNo
      />
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
         {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
        <Drawer.Screen name="Login" component={LoginScreen} options={{
          headerTitle: '',
        }} />
        <Drawer.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
        <Drawer.Screen name="Today Sales" component={TodaySales} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="All Products" component={AllProducts} />
        {/* <Drawer.Screen name="Secure Screen" component={SecureScreen} /> */}
        {/* <Drawer.Screen name="Sale Details" component={SaleDetails} /> */}

      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
