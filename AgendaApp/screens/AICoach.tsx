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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Definieer het type voor een chatbericht
interface ChatMessage {
  role: string;
  content: string;
  timestamp: string;
}

const CoachScreen = () => {
  const navigation = useNavigation();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // Haal chatgeschiedenis op bij laden van het scherm

  useEffect(() => {
    // Haal het e-mailadres van de ingelogde gebruiker op uit AsyncStorage
    const fetchUserEmail = async () => {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUserEmail(userData.user.email); // user.email uit het response object
        } catch (e) {
          setUserEmail(null);
        }
      }
    };
    fetchUserEmail();
  }, []);


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
        body: JSON.stringify({ prompt, email: userEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        // Voeg nieuwe berichten toe aan de geschiedenis
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Jouw Coach</Text>
        <Text style={styles.statusText}>Online</Text>

        {/* Chatgeschiedenis */}
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
            </View>
          ))}
        </View>

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
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E5F4FF',
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  statusText: {
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 20,
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
    marginTop: 20,
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