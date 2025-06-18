import React, { useState } from 'react';
import { ImageBackground, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useNavigation } from '@react-navigation/native';
import { registerstyles as styles} from '../styles/registerstyles';
import { Snackbar } from 'react-native-paper';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      setSnackbarMessage('Vul zowel e-mail als wachtwoord in.');
      setSnackbarVisible(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5133/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigation.navigate('Login');
      } else {
        const error = await response.text();
        setSnackbarMessage(`Registratie mislukt: ${error}`);
        setSnackbarVisible(true);
      }
    } catch (err) {
      console.error('Error tijdens registratie:', err);
      Alert.alert('Fout', 'Er is iets misgegaan bij het verbinden met de server.');
      alert("aaa")
    }
  };

  return (
    <View style={styles.background}>
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={{ marginBottom: 20 }}
        action={{
          label: 'Sluiten',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};



export default RegisterScreen;