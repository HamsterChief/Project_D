import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { registerstyles as styles} from '../styles/registerstyles';
// import * as Crypto from 'expo-crypto';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const hashPassword = async (password: string) => {
  //   return await Crypto.digestStringAsync(
  //     Crypto.CryptoDigestAlgorithm.SHA256,
  //     password
  //   );
  // };
  const handleError = (message: string, error?: unknown) => {
    console.error(message, error)
    console.log(message + " " + error)
    alert(message + "\n" + error)
  }

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Fout', 'Vul zowel e-mail als wachtwoord in.');
      return;
    }

    // const passwordHashed = await hashPassword(password); <-- happens on server-side (backend)

    try {
      const response = await fetch('http://localhost:5133/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        Alert.alert('Succes', 'Registratie gelukt!');
        navigation.navigate('Login');
      } else {
        const error = await response.text();
        handleError('Registratie mislukt', error)
        // Alert.alert('Registratie mislukt', error);
      }
    } catch (err) {
      // Alert.alert('Fout', 'Er is iets misgegaan bij het verbinden met de server.');
      handleError('Error tijdens registratie:', err);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/login.png')} // Use same background image as login screen
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registreer</Text>

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
          style={styles.button}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Registreren</Text>
        </TouchableOpacity>

        <Text style={styles.registerLink} onPress={() => navigation.navigate('Login')}>
          Al een account? Inloggen
        </Text>
      </View>
    </ImageBackground>
  );
};



export default RegisterScreen;