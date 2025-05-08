import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ImageBackground, Dimensions } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Ongeldig e-mailadres', 'Voer een geldig e-mailadres in.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Wachtwoord te kort', 'Je wachtwoord moet minstens 6 tekens bevatten.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Agenda');
    } catch (error: any) {
      console.log('Login error:', error);

      // Specifieke Firebase foutcodes
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Gebruiker niet gevonden', 'Er bestaat geen account met dit e-mailadres.');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Wachtwoord onjuist', 'Het wachtwoord dat je hebt ingevoerd is niet correct.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Ongeldig e-mailadres', 'Het ingevoerde e-mailadres is ongeldig.');
      } else {
        Alert.alert('Inloggen mislukt', 'Er ging iets fout. Probeer opnieuw.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/loginBackground.jpg')} // Path to your image
      style={styles.background}
      resizeMode="cover" // Or 'contain', depending on your design
    >
      <View style={styles.container}>
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
        <Button title="Inloggen" onPress={handleLogin} />
        <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
          Geen account? Registreer hier
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Full height and width
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Optional: white overlay to make form readable
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    height: 400,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(245,247,250, 0.85)',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 'auto',
    marginBottom: 'auto',
},
  login: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    maxWidth: 350,
    width: '100%'
  },
  registerLink: {
    marginTop: 16,
    textAlign: 'center',
    color: '#008bd1',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;