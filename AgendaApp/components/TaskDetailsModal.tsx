import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../utils/Types'


interface TaskDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onFinish?: (task: Task) => void;
  onRemove: (task: Task) => void;
}

const formatDateTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};


const TaskDetailsModal : React.FC<TaskDetailsModalProps> = ({ visible, onClose, task, onEdit, onFinish, onRemove }) => {
  if (!task) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.detail}>Beschrijving: {task.description}</Text>
          <Text style={styles.detail}>Start: {formatDateTime(task.startDate)}</Text>
          <Text style={styles.detail}>Einde: {formatDateTime(task.endDate)}</Text>

          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>Sluiten</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onEdit(task)} style={[styles.button, { backgroundColor: '#ffa500' }]}>
            <Text style={styles.buttonText}>Bewerk</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemove(task)} style={[styles.button, { backgroundColor: '#ff4d4d' }]}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
          {task && !task.finished && (
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => onFinish?.(task)}
            >
              <View style={styles.radioButtonOuter}>
                {task.finished && <View style={styles.radioButtonInner} />}
              </View>
              <Text style={styles.radioLabel}>
                Markeer als voltooid
              </Text>
            </TouchableOpacity>
          )}
          
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
  saveButton: {
    backgroundColor: '#4CAF50', // een frisse groene kleur voor "voltooien"
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // voor Android
  },
  radioContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 16,
},
radioButtonOuter: {
  height: 24,
  width: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: '#4CAF50',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
},

radioButtonInner: {
  height: 12,
  width: 12,
  borderRadius: 6,
  backgroundColor: '#4CAF50',
},
radioLabel: {
  fontSize: 16,
  color: '#333',
},
});
