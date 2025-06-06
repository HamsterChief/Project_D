import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Calendar from '../components/Calendar';
import TaskTimeline from '../components/TaskTimeLine';
import EditTaskModal from '../components/EditTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { PlusButton, fetchTasksForDate, editTask } from '../utils/Tasks';
import { Task } from '../utils/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';
import WeekDaysRow from '../components/WeekDaysRow';

const AgendaScreen = () => {
  const [expanded, setExpanded] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleEditTask = (task: Task) => {
    setShowTaskDetails(false);
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSaveEditedTask = async (updatedTask: Task) => {
    try {
      const result = await editTask(updatedTask, userId);
      setTasks(prev => prev.map(t => t.id === result.id ? result : t));

      setSnackbarMessage('Taak opgeslagen!');
      setSnackbarVisible(true);
      setShowEditModal(false);
    } catch (error : any) {
      const errorMessage =
        error?.response?.data?.message || // Als backend een duidelijke foutmelding geeft
        error?.message ||                // Algemene JS error
        'Onbekende fout bij opslaan taak.';
      setSnackbarMessage(errorMessage);
      setSnackbarVisible(true);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const data = await fetchTasksForDate(selectedDate, userId);
      setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, [selectedDate, userId]);

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

      {expanded ? (
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      ) : (
        <WeekDaysRow selectedDate={selectedDate} onDateChange={setSelectedDate} />
      )}

      <View style={styles.newTaskRow}>
        <Text style={{ color: '#333', fontSize: 16 }}>Nieuwe taak</Text>
        {userId ? <PlusButton userId={userId} onShowSnackbar={message => {
        setSnackbarMessage(message);
        setSnackbarVisible(true); }}
        /> : <Text style={{ color: 'gray' }}>Gebruiker laden...</Text>}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3399ff" style={{ marginTop: 20 }} />
      ) : (
        <TaskTimeline tasks={tasks} onTaskPress={handleTaskPress} />
      )}

      <TaskDetailsModal
        visible={showTaskDetails}
        onClose={() => setShowTaskDetails(false)}
        task={selectedTask}
        onEdit={handleEditTask}
      />

      <EditTaskModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={editingTask}
        onSave={handleSaveEditedTask}
        onShowSnackbar={(message) => {
          setSnackbarMessage(message);
          setSnackbarVisible(true);
        }}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000} // hoe lang zichtbaar (3 seconden)
        style={{marginBottom: 60}}
        action={{
          label: 'Sluiten',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
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
  newTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
