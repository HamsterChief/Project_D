import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser){
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        
        console.log()
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
      }
    }
    checkUser()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welkom bij AgendaApp</Text>
      <Text style={styles.subtitle}>Kies een optie om verder te gaan! </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login' as never)}
      >
        <Text style={styles.buttonText}>Inloggen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Registreren</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff8e7',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderColor: '#333',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#333',
  },
});