import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Task } from '../utils/Types';

interface EditTaskModalProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (updatedTask: Task) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ visible, onClose, task, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [pickerType, setPickerType] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStartDate(new Date(task.startDate));
      setEndDate(new Date(task.endDate));
    }
  }, [task]);

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

  const handleSave = () => {
    if (!task || !startDate || !endDate) return;

    const updatedTask: Task = {
      ...task,
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    onSave(updatedTask);
    onClose();
  };

  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Bewerk Taak</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titel"
            style={styles.input}
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Beschrijving"
            style={styles.input}
          />

          <TouchableOpacity onPress={() => setPickerType('start')}>
            <View pointerEvents="none">
              <TextInput
                value={formatDateTime(startDate)}
                placeholder="Startdatum en tijd"
                editable={false}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setPickerType('end')}>
            <View pointerEvents="none">
              <TextInput
                value={formatDateTime(endDate)}
                placeholder="Einddatum en tijd"
                editable={false}
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>
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

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>Opslaan</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Annuleer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditTaskModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#3399ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
