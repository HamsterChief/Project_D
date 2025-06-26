import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { loadAppSettings, backgrounds, AppSettingsProps, loadUser } from '../utils/AppSettingsUtils';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [appSettings, setAppSettings] = useState<AppSettingsProps | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userData = await loadUser();
        if (userData?.id) {
          setUser(userData);
          const settings = await loadAppSettings(userData.id);
          setAppSettings(settings);
        } else {
          console.warn('Gebruiker niet gevonden of geen geldig ID');
        }
      } catch (error) {
        console.error('Fout bij het laden van profiel of instellingen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3399ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={backgrounds[appSettings?.background || 'Grey']}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Ionicons name="person-circle-outline" size={100} color="#000" style={{ marginBottom: 20 }} />

        <Text style={styles.emailLabel}>Ingelogd als:</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Instellingen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Uitloggen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emailLabel: {
    fontSize: 24,
    color: '#000',
    marginBottom: 4,
  },
  email: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ProfileScreen;
