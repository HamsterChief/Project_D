import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

// Definieer het type voor een chatbericht
interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

const TAB_BAR_HEIGHT = 90; // zelfde als in je navigator

const CoachScreen = () => {
  const navigation = useNavigation();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Haal het e-mailadres en id van de ingelogde gebruiker op uit AsyncStorage
  useEffect(() => {
    const fetchUser = async () => {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUserEmail(userData.email);
          setUserId(userData.id);
        } catch (e) {
          setUserEmail(null);
          setUserId(null);
        }
      }
    };
    fetchUser();
  }, []);

  // Haal chatgeschiedenis op bij laden van het scherm
  useEffect(() => {
    if (!userEmail) return;
    const fetchHistory = async () => {
      try {
        const response = await fetch(`http://localhost:5133/api/ai/history?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data); // verwacht array van {role, content, timestamp}
        }
      } catch (error) {
        console.error('Kan chatgeschiedenis niet ophalen:', error);
      }
    };
    fetchHistory();
  }, [userEmail]);

  const handleAskCoach = async () => {
    if (!prompt.trim()) {
      alert('Voer een vraag of doel in.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5133/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Email: userEmail, Prompt: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: prompt, timestamp: new Date().toISOString() },
          { role: 'assistant', content: data.advice, timestamp: new Date().toISOString() }
        ]);
        setPrompt('');
      } else {
        const errorText = await response.text();
        console.error('Error from backend:', errorText);
        alert('Fout bij het ophalen van advies');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Kan geen verbinding maken met de server.');
    } finally {
      setLoading(false);
    }
  };

  // Parse AI advies naar taken (voorbeeld: "- 09:00 - 10:00: Taak A")
  function parseTasksFromAdvice(advice: string) {
    const lines = advice.split('\n');
    const tasks = [];
    for (const line of lines) {
      // Flexibele regex: accepteert optioneel '- ', spaties rond tijden, dubbele punt
      const match = line.match(/-?\s*(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2}):\s*(.+)/);
      if (match) {
        const [_, start, end, title] = match;
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        const startDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          startHour,
          startMin
        );
        const endDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          endHour,
          endMin
        );
        tasks.push({ title, startDate, endDate, description: '' });
      }
    }
    return tasks;
  }

  // Voeg een taak toe aan de agenda via backend
  async function addTaskToAgenda(task: { title: string, startDate: Date, endDate: Date, description: string }) {
  if (!userId) {
    Alert.alert('Gebruiker niet gevonden');
    return;
  }

  const offsetMs = new Date().getTimezoneOffset() * 60000;

  try {
    const response = await fetch('http://localhost:5133/api/task/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        startDate: new Date(task.startDate.getTime() - offsetMs).toISOString(),
        endDate: new Date(task.endDate.getTime() - offsetMs).toISOString(),
        userId,
      }),
    });

    if (response.ok) {
      // Optioneel: Alert.alert('Taak toegevoegd aan agenda!');
    } else {
      const message = await response.text();
      Alert.alert('Fout', message);
    }
  } catch (error) {
    Alert.alert('Netwerkfout');
  }
}


  // Voeg alle taken uit het advies toe
  async function addPlanningToAgenda(advice: string) {
    const tasks = parseTasksFromAdvice(advice);
    if (tasks.length === 0) {
      Alert.alert('Geen taken gevonden in het advies.');
      return;
    }
    let successCount = 0;
    for (const task of tasks) {
      await addTaskToAgenda(task);
      successCount++;
    }
    Alert.alert(`${successCount} taken toegevoegd aan je agenda!`);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Boven: Header en datumkiezer */}
        <Text style={styles.header}>Jouw Coach</Text>
        <Text style={styles.statusText}>Online</Text>
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Kies dag voor planning:</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={selectedDate.toISOString().slice(0, 10)}
              onChange={e => setSelectedDate(new Date(e.target.value))}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            />
          ) : (
            <>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={{
                  padding: 8,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#fff',
                  color: '#222'
                }}>
                  {selectedDate.toLocaleDateString('nl-NL')}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setSelectedDate(date);
                  }}
                />
              )}
            </>
          )}
        </View>

        {/* Midden: Chatgeschiedenis scrollbaar */}
        <View style={{ flex: 1, marginBottom: TAB_BAR_HEIGHT + 80 }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ marginVertical: 16 }}>
              {chatHistory.map((msg, idx) => (
                <View
                  key={idx}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#fff',
                    borderRadius: 10,
                    marginBottom: 8,
                    padding: 10,
                    maxWidth: '80%',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>
                    {msg.role === 'user' ? 'Jij' : 'Coach'}
                  </Text>
                  <Text>{msg.content}</Text>
                  {msg.role === 'assistant' && (
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        backgroundColor: '#3399ff',
                        padding: 8,
                        borderRadius: 8,
                      }}
                      onPress={() => addPlanningToAgenda(msg.content)}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>
                        Voeg planning toe aan agenda
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Onder: Input en knop altijd vast boven de tab bar */}
        <View style={styles.bottomBar}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Typ hier..."
              value={prompt}
              onChangeText={setPrompt}
              placeholderTextColor="#777"
            />
          </View>
          <TouchableOpacity style={styles.askButton} onPress={handleAskCoach} disabled={loading}>
            <Text style={styles.askButtonText}>Vraag Coach</Text>
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 10 }} />
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5F4FF',
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 50,
    color: '#222',
  },
  statusText: {
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5F4FF',
    paddingHorizontal: 20,
    paddingBottom: 100, // hoogte van je tab bar + extra ruimte
    paddingTop: 10,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    fontSize: 16,
    minHeight: 40,
  },
  askButton: {
    backgroundColor: '#007AFF',
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  askButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CoachScreen;