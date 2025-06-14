import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { homeStyles } from '../styles/homeStyles';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { DisplayTasksInHome } from '../components/DisplayTasksInHome';
import TaskDetailsModal from '../components/TaskDetailsModal';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../utils/Types';
import { PlusButton, editTask, finishTask, removeTask } from '../utils/Tasks';
import { Snackbar } from 'react-native-paper';
import EditTaskModal from '../components/EditTaskModal';

const HomeScreen = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const route = useRoute();
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const today = new Date();
  const hour = today.getHours();

  const dayNames = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  const monthNames = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  const greeting = hour < 12 ? 'Goedemorgen' : hour < 18 ? 'Goedemiddag' : 'Goedenavond';
  const dateText = `${dayNames[today.getDay()]} ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

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
  setSelectedTask(task);
  setEditingTask(task);
  setShowEditModal(true);
  setShowTaskDetails(false);
};

const handleSaveEditedTask = async (updatedTask: Task) => {
  if (!userId) return;
  try {
    const result = await editTask(updatedTask, userId);
    setTasks(prev => prev.map(t => t.id === result.id ? result : t));

    setRefreshToggle(prev => !prev);
    setSnackbarMessage('Taak opgeslagen!');
    setSnackbarVisible(true);
    setShowEditModal(false);
  } catch (error: any) {
    setSnackbarMessage(error?.message || 'Fout bij opslaan taak.');
    setSnackbarVisible(true);
  }
};


  const handleFinishTask = async (task: Task) => {
    if (!userId) return;
    try {
      const updated = await finishTask(task, userId);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setSnackbarMessage('Taak gemarkeerd als voltooid!');
      setSnackbarVisible(true);
      setShowTaskDetails(false);
    } catch (error: any) {
      setSnackbarMessage(error?.message || 'Fout bij voltooien taak.');
      setSnackbarVisible(true);
    }
  };

  const handleRemoveTask = async (task: Task) => {
    if (!userId) return;
    try {
      await removeTask(task, userId);
      setTasks(prev => prev.filter(t => t.id !== task.id));
      setSnackbarMessage('Taak succesvol verwijderd!');
      setSnackbarVisible(true);
      setShowTaskDetails(false);
    } catch (error: any) {
      setSnackbarMessage(error?.message || 'Fout bij verwijderen taak.');
      setSnackbarVisible(true);
    }
  };

  const openCreateTaskModal = () => {
  setModalVisible(true);
};

// En een handler om de modal te sluiten
const closeCreateTaskModal = () => {
  setModalVisible(false);
  setRefreshToggle(prev => !prev); // om lijst te verversen
};

  useFocusEffect(
    useCallback(() => {
      setRefreshToggle(prev => !prev);
    }, [])
  );

  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.greeting}>{greeting}</Text>
      <Text style={homeStyles.date}>{dateText}</Text>
      <View style={homeStyles.headerDivider} />

      

      <Text style={homeStyles.sectionTitle}>Jouw taken voor vandaag:</Text>

      {userId !== null && (
        <>
          <View style={{ position: 'absolute', top: 200, right: 20, zIndex: 100, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#000', fontSize: 16, marginRight: 8 }}>Nieuwe taak</Text>
            <PlusButton
              userId={userId}
              onShowSnackbar={(message) => {
                setSnackbarMessage(message);
                setSnackbarVisible(true);
                setRefreshToggle(prev => !prev);
              }}
            />
          </View>

          <DisplayTasksInHome
            userId={userId}
            date={new Date()}
            maxCount={3}
            refreshToggle={refreshToggle}
            onTaskPress={handleTaskPress}
          />
        </>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Agenda')}>
        <Text style={homeStyles.linkText}>Bekijk alles</Text>
      </TouchableOpacity>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        action={{
          label: 'Sluiten',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>

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
    </View>
  );
};

export default HomeScreen;
