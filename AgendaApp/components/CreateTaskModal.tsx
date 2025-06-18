import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CreateTaskModalStyles as styles } from '../styles/CreateTaskModalStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  userId: number;
  onShowSnackbar: (message: string) => void;
}

export const CreateTaskModal: React.FC<Props> = ({ visible, onClose, userId, onShowSnackbar }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  

  const formatDateTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleConfirm = (date: Date) => {
    if (pickerType === 'start') setStartDate(date);
    if (pickerType === 'end') setEndDate(date);
    setPickerType(null);
  };

  const handleCreateTask = async () => {
    if (!title || !description || !startDate || !endDate) {
      Alert.alert('Vul alle verplichte velden in.');
      return;
    }
    
    const offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
    try {
      const response = await fetch('http://localhost:5133/api/task/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          startDate: new Date(startDate.getTime() - offsetMs).toISOString(),
          endDate: new Date(endDate.getTime() - offsetMs).toISOString(),
          userId,
        }),
        
      });

      if (response.ok) {
        onShowSnackbar('Taak aangemaakt!');
        setTitle('');
        setDescription('');
        setStartDate(null);
        setEndDate(null);
        onClose();
      } else {
        const message = await response.text();
        onShowSnackbar(message);
      }
    } catch (error) {
      console.error('Netwerkfout:', error);
      onShowSnackbar('Netwerkfout');
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Nieuwe Taak</Text>

          <TextInput
            style={styles.input}
            placeholder="Titel"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.input}
            placeholder="Beschrijving"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#999"
          />

          <TouchableOpacity onPress={() => setPickerType('start')}>
            <TextInput
              style={styles.input}
              placeholder="Startdatum en tijd"
              value={formatDateTime(startDate)}
              editable={false}
              pointerEvents="none"
              placeholderTextColor="#999"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPickerType('end')}>
            <TextInput
              style={styles.input}
              placeholder="Einddatum en tijd"
              value={formatDateTime(endDate)}
              editable={false}
              pointerEvents="none"
              placeholderTextColor="#999"
            />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={pickerType !== null}
            mode="datetime"
            date={pickerType === 'start' ? startDate || new Date() : endDate || new Date()}
            onConfirm={handleConfirm}
            onCancel={() => setPickerType(null)}
            display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
            themeVariant="light"
            isDarkModeEnabled={false}
          />

          <View style={styles.buttonRow}>
            <Button title="Annuleren" onPress={onClose} color="#999" />
            <Button title="Aanmaken" onPress={handleCreateTask} />
          </View>

          
        </View>
      </View>
    </Modal>
  );
};
