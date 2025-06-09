import React, { useState } from 'react';
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

const CoachScreen = () => {
  const navigation = useNavigation();
  const [prompt, setPrompt] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = 1; // tijdelijk hardcoded voor test

  const handleAskCoach = async () => {
    if (!prompt.trim()) {
      alert('Voer een vraag of doel in.');
      return;
    }

    setLoading(true);
    setAdvice('');

    try {
      const response = await fetch('http://localhost:5133/api/ai/coach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        setAdvice(data.advice);
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

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.buttonText}>Bekijk planning</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mainButton}>
            <Text style={styles.buttonText}>Voeg taak toe</Text>
          </TouchableOpacity>
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

        <TouchableOpacity style={styles.askButton} onPress={handleAskCoach}>
          <Text style={styles.askButtonText}>Vraag Coach</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        )}

        {advice ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseLabel}>Coach zegt:</Text>
            <Text style={styles.responseText}>{advice}</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // ...bestaande styles...
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
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
  responseContainer: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  responseLabel: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 16,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CoachScreen;