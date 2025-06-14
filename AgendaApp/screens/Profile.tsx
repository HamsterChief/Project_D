import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { profileStyles } from '../styles/profileStyles';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser.user);
        }
      } catch (error) {
        console.error('Fout bij het laden van gebruiker:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  };

  if (loading) {
    return (
      <View style={profileStyles.container}>
        <ActivityIndicator size="large" color="#3399ff" />
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <Text style={profileStyles.title}>Profiel</Text>

      {/* Email in één lijn */}
      <View style={profileStyles.inlineRow}>
        <Text style={profileStyles.label}>Email:</Text>
        <Text style={profileStyles.text}>{user?.email}</Text>
      </View>

      {/* Knoppen als een geheel */}
      <TouchableOpacity
        style={profileStyles.button}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
        <Text style={profileStyles.buttonText}>Instellingen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={profileStyles.button}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={profileStyles.buttonText}>Uitloggen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;