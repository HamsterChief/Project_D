// src/screens/AgendaScreen.tsx
import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

type Appointment = {
  id: string;
  title: string;
  date: string;
};

const appointments: Appointment[] = [
  { id: '1', title: 'Meeting met Taha', date: '2025-04-24 14:00' },
  { id: '2', title: 'Chillen met Henk', date: '2025-04-25 09:30' },
  { id: '3', title: 'Lunch met team', date: '2025-04-26 12:00' },
];

const AgendaScreen = () => {
  const showReminder = (appointment: Appointment) => {
    alert(`Herinnering:\nJe hebt een afspraak met ${appointment.title} op ${appointment.date}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mijn Afspraken</Text>
      <FlatList
        data={appointments}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.text}>{item.date}</Text>
            <Button title="Herinnering" onPress={() => showReminder(item)} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  text: {
    marginBottom: 5,
  },
});

export default AgendaScreen;
