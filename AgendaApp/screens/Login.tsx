import { loginStyles as styles} from '../styles/loginstyles';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parse } from '@babel/core';
import { AppSettingsProps, loadAppSettings, backgrounds, loadUser } from '../utils/AppSettingsUtils';


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [user, setUser] = useState();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleError = (message: string, error?: unknown) => {
  console.error(message, error);
  console.log(message + " " + error);
  alert(message + "\n" + error);
  }
  
  useEffect(() => {
  const checkUser = async () => {
    const parsedUser = await loadUser(); // gebruik de gedeelde functie
    if (parsedUser) {
      setUser(parsedUser);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  };

  checkUser();
}, []);

  const handleLogin = async () => {
    try {
      const user = { email, password };
      const response = await fetch('http://localhost:5133/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        await AsyncStorage.setItem('user', JSON.stringify(userData.user));
        console.log('User data from API:', userData); // Check userID send in the state body during login
        setUser(userData.user);
        
        Alert.alert('Succesvol ingelogd', 'Welkom terug!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        const errorText = await response.text();
        Alert.alert('Login mislukt', errorText || 'Onbekende fout');
        handleError('Login mislukt', errorText);
      }
    } catch (error) {
      handleError('Login error:', error);
      Alert.alert('Fout', 'Kon geen verbinding maken met de server.');
    }
};


  return (
    <View style={styles.background}>
      <View style={styles.container}>

        <Text style={styles.title}>Inlogscherm</Text>

        <TextInput
          placeholder="E-mail"
          placeholderTextColor='#909090'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Wachtwoord"
          placeholderTextColor='#909090'
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isPressed && styles.hoveredButton]}
          onPress={handleLogin}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          <Text style={styles.buttonText}>INLOGGEN</Text>
        </TouchableOpacity>
        
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Geen account? Registreer hier
        </Text>

      </View>
    </View>
  );
};



export default LoginScreen;