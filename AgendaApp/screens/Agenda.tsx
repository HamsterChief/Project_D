import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types'; // Adjust path if needed
import CalendarPopup from './CalanderPop';
import { FaCalendarAlt } from 'react-icons/fa';

type Appointment = {
  id: string;
  title: string;
  date: string;
  audioUri?: string;
};

const initialAppointments: Appointment[] = [
  { id: '1', title: 'Meeting met Taha', date: '2025-04-24 14:00' },
  { id: '2', title: 'Chillen met Henk', date: '2025-04-25 09:30' },
  { id: '3', title: 'Lunch met team', date: '2025-04-26 12:00' },
];

const AgendaScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Microfoon toestemming is nodig om op te nemen!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions: Audio.RecordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (err) {
      console.error('Fout bij opnemen', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    // Voeg de nieuwe opname toe als nieuwe afspraak
    setAppointments((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        title: `Opname ${new Date().toLocaleTimeString()}`,
        date: new Date().toLocaleString(),
        audioUri: uri || undefined,
      },
    ]);

    setRecording(null);
    console.log('Audio opgeslagen bij:', uri);
  };

  const playRecording = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.setVolumeAsync(1.0); // volume op maximaal
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mijn Afspraken</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.logout} onPress={() => navigation.navigate('Login')}>
            Logout
          </Text>
          <FaCalendarAlt
            size={24}
            style={{ marginLeft: 16, color: '#007AFF', cursor: 'pointer' }}
            onClick={() => setShowCalendar((prev) => !prev)}
          />
        </View>
      </View>

      <FlatList
        data={appointments}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.title}</Text>
            <Text style={styles.text}>{item.date}</Text>
            <Button
              title="Herinnering"
              onPress={() => alert(`Herinnering voor ${item.title}`)}
            />
            {item.audioUri && (
              <Button title="Afspelen" onPress={() => playRecording(item.audioUri!)} />
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.audioControls}>
        <Button
          title={recording ? 'Stop opname' : 'Start opname'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>

      {showCalendar && (
        <View style={{ position: 'absolute', top: 60, right: 20, zIndex: 100 }}>
          <CalendarPopup showOnlyCalendar />
          <Button title="Sluiten" onPress={() => setShowCalendar(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 5,
  },
  audioControls: {
    marginTop: 30,
    gap: 10,
  },
  logout: {
    fontSize: 16,
    color: 'blue',
  },
});

export default AgendaScreen;