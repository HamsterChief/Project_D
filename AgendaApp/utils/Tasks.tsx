import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, ImageBackground, Pressable, Image } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
//import { loginStyles as styles} from '../styles/loginstyles';
import { Audio } from 'expo-av';
import { TouchableOpacity } from 'react-native';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { Appointment } from '../utils/dbcon';
import { getLocalDateString } from '../components/Calendar';
import { Task } from '../utils/Types'



export const PlusButton = ({
  userId,
  onShowSnackbar,
}: {
  userId: number;
  onShowSnackbar: (message: string) => void;
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [pressed ? styles.pressed : styles.notPressed]}
      >
        <Image style={styles.icon} source={require('../assets/IconPlus.png')} />
      </Pressable>

      <CreateTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userId={userId}
        onShowSnackbar={onShowSnackbar} 
      />
    </View>
  );
};



export const fetchTasksForDate = async (date: Date, userId: number | null) => {
  if (!userId) return [];

  const dateStr = getLocalDateString(date);
  const url = `http://localhost:5133/api/task/date/${dateStr}/user/${userId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Serverfout: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fout bij ophalen van taken:', error);
    return [];
  }
}



export const editTask = async (task: Task, userId: number | null) => {
  const url = `http://localhost:5133/api/task/edit/${task.id}/user/${userId}`;

 
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }

    const data = await response.json();
    return data;
}


export const finishTask = async (task: Task, userId: number | null) => {
  const url = `http://localhost:5133/api/task/finish/${task.id}/user/${userId}`;
  console.log("Fetch URL:", url);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Fout response:', response.status, errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data: Task = await response.json();
  return data;
};


export const removeTask = async (task: Task, userId: number | null) => {
  const response = await fetch(`http://localhost:5133/api/task/remove/${task.id}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Fout bij verwijderen taak:', errorText);
    throw new Error(errorText || 'Fout bij verwijderen taak');
  }

  const data: Task = await response.json();
  return data;
};





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
      <Image style={styles.icon} source={audioUri ? require('../assets/IconSoundPlay.png') : require('../assets/IconSoundRecord.png')}/>
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

// type Appointment = {
//   id: number;
//   email: string;
//   title: string;
//   description: string;
//   startDate: Date;
//   endDate: Date;
//   audioUri?: string;
// };

// const initialAppointments: Appointment[] = [
//   { id: 1, email: 'melvernvandijk@outlook.com', title: 'Meeting', description:'Meeting met Taha', startDate: new Date('2025-04-24T14:00'), endDate: new Date('2025-04-24T15:00') },
//   { id: 2, email: 'taha@gmail.com', title: 'Chillen', description:'Chillen met Henk', startDate: new Date('2025-04-25T09:30'), endDate: new Date('2025-04-24T10:00') },
//   { id: 3, email: 'lucathierry@live.nl', title: 'Lunch', description:'Lunch met team', startDate: new Date('2025-04-26T12:00'), endDate: new Date('2025-04-24T13:00') },
// ];

interface Props {
  initialAppointments: Appointment[]
}

export const DisplayTasks : React.FC<Props> = ({initialAppointments}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleAudioUriUpdate = (id: number, uri: string | null) => {
    setAppointments(prev => 
      prev.map(app => (app.id === id ? { ...app, audioUri: uri || undefined } : app))
    );
  };

  const grouped = groupAppointmentsByTime(appointments);
  const userEmail = (useRoute().params as any)?.email ?? '';
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {Object.entries(grouped).filter(([_, apps]) => apps.length > 0).map(([timeOfDay, apps]) =>
        <View key={timeOfDay} style={styles.timeSection}>
          {apps
            .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
            .map(app => (
              <View key={app.id} style={styles.appointment}>
                <Text>{app.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}</Text>
                <Pressable onPress={() => setModalVisible(true)}>{app.title}</Pressable>
                <AudioRecorderButton appointment={app} onUri={(uri) => handleAudioUriUpdate(app.id, uri)}/>

                <CreateTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} userEmail={userEmail} />
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
      marginBottom: 24,
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: '#fff'
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