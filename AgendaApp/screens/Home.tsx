import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { homeStyles } from '../styles/homeStyles';
import CreateTaskModal from '../components/CreateTaskModal';
import { useRoute } from '@react-navigation/native';

const HomeScreen = () => {
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

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.greeting}>{greeting}</Text>
      <Text style={homeStyles.date}>{dateText}</Text>

      <TouchableOpacity
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

      

      <CreateTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} userEmail={userEmail} />
    </View>
  );
};

export default HomeScreen;
