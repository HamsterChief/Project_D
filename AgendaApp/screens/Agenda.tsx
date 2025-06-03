import React, { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Calendar from '../components/Calendar';
import TaskTimeline from '../components/TaskTimeLine';
import { PlusButton, fetchTasksForDate } from '../utils/Tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AgendaScreen = () => {
  const navigation = useNavigation();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser.id);
        }
      } catch (error) {
        console.error('Gebruiker laden fout:', error);
      }
    };
    loadUser();
  }, []);


  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const data = await fetchTasksForDate(selectedDate, userId);
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, [selectedDate, userId]);


  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    // Optionally reset user state if you use Context or Redux
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <Text style={styles.title}>Agenda</Text>
        <Text style={styles.textualButton} onPress={() => handleLogout()}>
            Logout
        </Text>
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

      {expanded && (
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      )}

      <View style={styles.newTaskRow}>
        <Text style={{ color: '#333', fontSize: 16 }}>Nieuwe taak</Text>
        {userId ? <PlusButton userId={userId} /> : <Text style={{ color: 'gray' }}>Gebruiker laden...</Text>}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3399ff" style={{ marginTop: 20 }} />
      ) : (
        <TaskTimeline tasks={tasks} />
      )}
    </View>
  );
};


export default AgendaScreen;

const styles = StyleSheet.create({
  headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 20,
  },
  link: {
    fontSize: 16,
    color: 'blue',
  },
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
  item: {
  marginBottom: 20,
  padding: 15,
  backgroundColor: '#f2f2f2',
  borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    paddingTop: 30,
  },
  text: {
    marginBottom: 5,
  },
  audioControls: {
    marginTop: 30,
    gap: 10,
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
  newTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
    textualButton: {
    fontSize: 16,
    color: 'blue',
  },
});
