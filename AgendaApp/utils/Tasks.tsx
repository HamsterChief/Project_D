import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, ImageBackground, Pressable, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
//import { loginStyles as styles} from '../styles/loginstyles';
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native';

export const PlusButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() => navigation.navigate('Task')}
      style={({ pressed }) => [pressed ? styles.pressed : styles.notPressed]}
    >
      <Image style={styles.icon} source={require('../assets/IconPlus.png')} />
    </Pressable>
  );
}

const getTimeGroup = (date: Date) => {
  const hour = date.getHours();
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Afternoon'
  if (hour >= 18 && hour < 24) return 'Evening'
  return 'Night';
};

const groupAppointmentsByTime = (appointments: Appointment[]) => {
  const groups: { [key: string]: Appointment[] } = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Night: [],
  };

  appointments.forEach(app => {
    const group = getTimeGroup(app.startDate);
    groups[group].push(app);
  });

  return groups;
};

export const AudioRecorderButton = ({ appointment, onUri }: { appointment: Appointment, onUri: (uri: string | null) => void }) => {
  const [audioUri, SetAudioUri] = useState<string | null>(appointment.audioUri || null);
  const { recording, startRecording, stopRecording, playRecording } = useAudioRecorder();

  const handlePress = async () => {
    if (recording) {
      const uri = await stopRecording();
      SetAudioUri(uri);
      onUri(uri);
    } else if (audioUri) {
      await playRecording(audioUri);
    } else {
      startRecording();
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [pressed ? styles.pressed : styles.notPressed]}
    >
      <Image style={styles.icon} source={require('../assets/IconPlus.png')} />
    </Pressable>
  );
}

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

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

  const stopRecording = async (): Promise<string | null> => {
    if (!recording) return null;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    console.log('Audio opgeslagen bij:', uri);
    return uri;
  };

  const playRecording = async (uri: string) => {
    const { sound } = await Audio.Sound.createAsync({ uri });
    setSound(sound);
    await sound.setVolumeAsync(1.0);
    await sound.playAsync();
  };

  return {
    recording,
    startRecording,
    stopRecording,
    playRecording,
  };
};

type Appointment = {
  id: number
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  audioUri?: string;
};

const initialAppointments: Appointment[] = [
  { id: 1, title: 'Meeting', description:'Meeting met Taha', startDate: new Date('2025-04-24T14:00'), endDate: new Date('2025-04-24T15:00') },
  { id: 2, title: 'Chillen', description:'Chillen met Henk', startDate: new Date('2025-04-25T09:30'), endDate: new Date('2025-04-24T10:00') },
  { id: 3, title: 'Lunch', description:'Lunch met team', startDate: new Date('2025-04-26T12:00'), endDate: new Date('2025-04-24T13:00') },
];

const DisplayTasks = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleAudioUriUpdate = (id: number, uri: string | null) => {
    setAppointments(prev => 
      prev.map(app => (app.id === id ? { ...app, audioUri: uri || undefined } : app))
    );
  };

  const grouped = groupAppointmentsByTime(appointments);

  return (
    <View style={styles.container}>
      {Object.entries(grouped).map(([timeOfDay, apps]) =>
        <View key={timeOfDay} style={styles.timeSection}>
          {apps
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
            .map(app => (
              <View key={app.id} style={styles.appointment}>
                <Text>{app.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</Text>
                <Button title='update' onPress={CreateTaskModal}/>
                <AudioRecorderButton appointment={app} onUri={(uri) => handleAudioUriUpdate(app.id, uri)}/>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0
    },
    notPressed: {
        opacity: 1
    },
    icon: {
        width: 36,
        height: 36
    },
    timeSection: {
      marginBottom: 24
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    appointment: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
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
