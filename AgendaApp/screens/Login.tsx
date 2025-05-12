import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
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
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>
      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Wachtwoord"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
          <Text>{isPasswordVisible ? 'Verbergen' : 'Weergeven'}</Text>
        </TouchableOpacity>
      </View>
      <Button title="Inloggen" onPress={handleLogin} />
      <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
        Geen account? Registreer hier
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  registerLink: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleButton: {
    marginLeft: 10,
  },
});

export default LoginScreen;