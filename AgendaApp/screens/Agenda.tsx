import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Calendar from '../components/Calendar'; 
import { PlusButton, DisplayTasks } from '../utils/Tasks';
import { initialAppointments } from '../utils/dbcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AgendaScreen = () => {
  const [expanded, setExpanded] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.id);
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error('Fout bij het laden van gebruiker:', error);
        setUserId(null);
      }
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <Text style={styles.title}>Agenda</Text>
        <TouchableOpacity
          onPress={() => setExpanded(prev => !prev)}
          style={styles.toggleButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <FontAwesome
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={28}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {expanded && <Calendar />}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <Text style={{ color: '#333', fontSize: 16 }}>Nieuwe taak</Text>
        {userId !== null && userId > 0 ? (
          <PlusButton userId={userId} />
        ) : (
          <Text style={{ color: 'gray' }}>Gebruiker laden...</Text>
        )}
      </View>

      <DisplayTasks initialAppointments={initialAppointments} />
    </View>
  );
};

export default AgendaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e7',
    padding: 20,
  },
  toggleRow: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingTop: 30,
  },
  toggleButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -14 }],
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
});
