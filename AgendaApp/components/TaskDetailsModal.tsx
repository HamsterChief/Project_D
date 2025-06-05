import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../utils/Types'


interface TaskDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
}


const TaskDetailsModal : React.FC<TaskDetailsModalProps> = ({ visible, onClose, task, onEdit }) => {
  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.detail}>Beschrijving: {task.description}</Text>
          <Text style={styles.detail}>Start: {task.startDate}</Text>
          <Text style={styles.detail}>Einde: {task.endDate}</Text>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Sluiten</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(task)} style={[styles.button, { backgroundColor: '#ffa500' }]}>
            <Text style={styles.buttonText}>Bewerk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};


export default TaskDetailsModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  detail: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#3399ff',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
