import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { homeStyles } from '../styles/homeStyles';
import {CreateTaskModal} from '../components/CreateTaskModal';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);

  const route = useRoute();
  const today = new Date();
  const hour = today.getHours();

  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const monthNames = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  const greeting = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';
  const dateText = `${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const [modalVisible, setModalVisible] = useState(false);

  const userEmail = (route.params as any)?.email ?? '';
  console.log('userEmail in Home:', userEmail);


  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser && isMounted) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser.user);
        }
      } catch (error) {
        console.error('Gebruiker laden fout:', error);
      }
    };
    loadUser();
  }, []);

  if (user != null)
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.greeting}>{greeting}</Text>
      <Text style={homeStyles.date}>{dateText}</Text>
      <Text style={styles.textualButton} onPress={() => handleLogout()}>
          Logout
      </Text>

      {/* <TouchableOpacity
        style={{
          marginTop: 40,
          padding: 15,
          backgroundColor: '#007bff',
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>➕ Nieuwe taak</Text>
      </TouchableOpacity>

      

      <CreateTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} userEmail={userEmail} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
      textualButton: {
    fontSize: 16,
    color: 'blue',
  },
})

export default HomeScreen;
