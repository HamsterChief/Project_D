import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Calendar from '../components/Calendar';
import TaskTimeline from '../components/TaskTimeLine';
import EditTaskModal from '../components/EditTaskModal';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { PlusButton, fetchTasksForDate, editTask, finishTask, removeTask } from '../utils/Tasks';
import { Task } from '../utils/Types';
import { Snackbar } from 'react-native-paper';
import WeekDaysRow from '../components/WeekDaysRow';
import { AppSettingsProps, loadAppSettings, backgrounds, loadUser } from '../utils/AppSettingsUtils';



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
  const [appSettings, setAppSettings] = useState<AppSettingsProps | null>(null);

  const navigation = useNavigation();
  // const [recording, setRecording] = useState<Audio.Recording | null>(null);
  // const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
  const checkUser = async () => {
    const userData = await loadUser();
    console.warn("user in agenda:", userData)
    setUserId(userData.id);
    const settings = await loadAppSettings(userData.id);
    setAppSettings(settings);
  };

  checkUser();
}, []);

  const reloadTasks = async () => {
  if (!userId) return;
  setLoading(true);
  const data = await fetchTasksForDate(selectedDate, userId);
  setTasks(data);
  setLoading(false);
};

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetails(true);
  };

  const handleEditTask = (task: Task) => {
    setShowTaskDetails(false);
    setEditingTask(task);
    setShowEditModal(true);
  };

  const panResponder = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20; // alleen reageren op horizontale swipe
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        // swipe naar rechts → vorige dag
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
      } else if (gestureState.dx < -50) {
        // swipe naar links → volgende dag
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
      }
    },
  })
).current;

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

  const handleFinishTask = async (task: Task) => {
    try {
      const updated = await finishTask(task, userId);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setSnackbarMessage("Taak gemarkeerd als voltooid!");
      setSnackbarVisible(true);
      setShowTaskDetails(false);
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data || "Fout bij voltooien taak.");
      setSnackbarVisible(true);
    }
  };

  const handleRemoveTask = async (task: Task) => {
  try {
    await removeTask(task, userId);
    setTasks(prev => prev.filter(t => t.id !== task.id));
    setSnackbarMessage("Taak succesvol verwijderd!");
    setSnackbarVisible(true);
    setShowTaskDetails(false);
  } catch (error: any) {
    setSnackbarMessage(error.message || "Fout bij verwijderen taak.");
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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    // Optionally reset user state if you use Context or Redux
    navigation.navigate('Login');
  };

  // const { preferredColor, font, background } = appSettings;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
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
        setSnackbarVisible(true);
        reloadTasks()
      }}

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
        onFinish={handleFinishTask}
        onRemove={handleRemoveTask}
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
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f3ff', // fallback kleur als afbeelding niet laadt
  },
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
