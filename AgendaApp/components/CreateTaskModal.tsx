import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  userEmail: string;  
}

export const CreateTaskModal: React.FC<Props> = ({ visible, onClose, userEmail }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreateTask = async () => {
    if (!title || !description || !startDate || !endDate) {
      Alert.alert("Vul alle verplichte velden in.");
      return;
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      Alert.alert("Ongeldige datum", "Gebruik een geldig formaat, bijvoorbeeld: 2025-06-01T14:00");
      return;
    }

    console.log('userEmail:', userEmail);

    try {
      const response = await fetch('http://localhost/api/task/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          startDate: parsedStartDate.toISOString(),
          endDate: parsedEndDate.toISOString(),
          userEmail
        }),
      });

      if (response.ok) {
        Alert.alert('Succes', 'Taak aangemaakt!');
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        onClose();
      } else {
        const message = await response.text();
        Alert.alert('Fout', message || 'Fout bij het aanmaken.');
      }
    } catch (error) {
      console.error('Netwerkfout:', error);
      Alert.alert('Netwerkfout');
    }
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Nieuwe Taak</Text>

          <TextInput style={styles.input} placeholder="Titel" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Beschrijving" value={description} onChangeText={setDescription} />
          <TextInput style={styles.input} placeholder="Startdatum (bv. 2025-06-01T14:00)" value={startDate} onChangeText={setStartDate} />
          <TextInput style={styles.input} placeholder="Einddatum (bv. 2025-06-01T16:00)" value={endDate} onChangeText={setEndDate} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
            <Button title="Annuleren" onPress={onClose} color="#999" />
            <Button title="Aanmaken" onPress={handleCreateTask} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
  },
});
