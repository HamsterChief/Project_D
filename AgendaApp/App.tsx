import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import AgendaScreen from './screens/Agenda';
import RegisterScreen from './screens/Register';
import AppSettingsScreen from './screens/AppSettings';



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
        <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
