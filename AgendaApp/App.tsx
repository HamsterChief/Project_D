import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import WelcomeScreen from './screens/Welcome';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import SettingsScreen from './screens/Settings';
import HomeScreen from './screens/Home';
import AgendaScreen from './screens/Agenda';
import ProfileScreen from './screens/Profile';
import CoachScreen from './screens/AICoach';
import AppSettingsScreen from './screens/AppSettings';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false,   
      headerShown: false,
      tabBarStyle: {
        position: 'absolute',
        backgroundColor: '#fff',
        paddingBottom: 5,
        height: 90,
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require('./assets/IconHome.png')}
            style={[styles.icon, { tintColor: focused ? '#333' : 'gray' }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Agenda"
      component={AgendaScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require('./assets/IconCalendar.png')}
            style={[styles.icon, { tintColor: focused ? '#333' : 'gray' }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="AI Coach"
      component={CoachScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require('./assets/IconAICoach.png')}
            style={[styles.icon, { tintColor: focused ? '#333' : 'gray' }]}
          />
        ),
      }}  
    />
    <Tab.Screen
      name="Profiel"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require('./assets/IconProfile.png')}
            style={[styles.icon, { tintColor: focused ? '#333' : 'gray' }]}
          />
        ),
      }}
    />
    <Tab.Screen
      name="Settings"
      component={settingsScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <Image
            source={require('./assets/IconSettings.png')}
            style={[styles.icon, { tintColor: focused ? '#333' : 'gray' }]}
          />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: true, title: 'Inloggen'}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: true, title: 'Registreren'}}/>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="AppSettings" component={AppSettingsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 36,
    height: 36,
    marginTop: 30,
  },
});

export default App;
