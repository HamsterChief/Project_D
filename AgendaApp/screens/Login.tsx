import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { loginStyles as styles} from '../styles/loginstyles';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        // Navigate to Agenda if already logged in
        navigation.navigate('Agenda');
      }
    };
    checkUser();
  }, []);
  const handleLogin = async () => {
    try {
      const user = { email, password };
      const response = await fetch('http://localhost:5133/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        console.log('User data from API:', userData); // Check userID send in the state body during login
        setUser(userData);
        
        Alert.alert('Succesvol ingelogd', 'Welkom terug!');
        navigation.navigate('Agenda');
      } else {
        const message = await response.text();
        handleError('Login mislukt', message);
      }
    } catch (error) {
      handleError('Login error:', error);
      Alert.alert('Fout', 'Kon geen verbinding maken met de server.');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/login.png')} // Path to your image
      style={styles.background}
      resizeMode="cover" // Or 'contain', depending on your design
    >
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
    </ImageBackground>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   registerLink: {
//     marginTop: 16,
//     textAlign: 'center',
//     color: '#007BFF',
//     textDecorationLine: 'underline',
//   },
// });

export default LoginScreen;