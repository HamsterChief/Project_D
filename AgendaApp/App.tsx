import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import AgendaScreen from './screens/Agenda';
import RegisterScreen from './screens/Register';
import SettingsScreen from './screens/Settings';
import ProfileScreen from './screens/Profile';
import AppSettingsScreen from './screens/AppSettings';
import CoachScreen from './screens/AICoach';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Agenda" component={AgendaScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
        <Stack.Screen name="AICoach" component={CoachScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}