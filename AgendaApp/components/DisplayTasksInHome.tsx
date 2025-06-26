import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import { Task } from '../utils/Types';
import { fetchTasksForDate } from '../utils/Tasks';
import { homeStyles } from '../styles/homeStyles';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const DisplayTasksInHome = ({
  date,
  userId,
  maxCount,
  refreshToggle,
  onTaskPress,
}: {
  date: Date;
  userId: number;
  maxCount?: number;
  refreshToggle?: boolean;
  onTaskPress?: (task: Task) => void;
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingTaskId, setPlayingTaskId] = useState<number | null>(null);
  const [audioUris, setAudioUris] = useState<{ [key: number]: string }>({}); // taskId -> audio uri

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchTasksForDate(date, userId);
      setTasks(maxCount ? data.slice(0, maxCount) : data);

      // Laad audioUri's uit AsyncStorage
      const newUris: { [key: number]: string } = {};
      for (const task of data) {
        const storedUri = await AsyncStorage.getItem(`audioUri_${task.id}`);
        if (storedUri) {
          newUris[task.id] = storedUri;
        }
      }
      setAudioUris(newUris);
    };
    fetch();
  }, [date, userId, refreshToggle]);

  const startRecording = async (taskId: number) => {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== 'granted') {
      alert('Microfoon toestemming is nodig!');
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    setRecording(recording);
  };

  const stopRecording = async (taskId: number) => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      await AsyncStorage.setItem(`audioUri_${taskId}`, uri);
      setAudioUris((prev) => ({ ...prev, [taskId]: uri }));
    }
  };

  const playAudio = async (uri: string, taskId: number) => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
  }
  const { sound: newSound } = await Audio.Sound.createAsync({ uri });
  setSound(newSound);
  setPlayingTaskId(taskId);

  await newSound.setVolumeAsync(1.0); // 🔊 Zet volume op maximaal
  await newSound.playAsync();

  newSound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isPlaying) {
      setPlayingTaskId(null);
    }
  });
};

  const toggleAudio = async (taskId: number) => {
    if (recording) {
      await stopRecording(taskId);
    } else if (audioUris[taskId]) {
      await playAudio(audioUris[taskId], taskId);
    } else {
      await startRecording(taskId);
    }
  };

  const formatTime = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View style={hstyles.taskListContainer}>
      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          activeOpacity={0.7}
          onPress={() => onTaskPress && onTaskPress(task)}
        >
          <View style={hstyles.row}>
            <View style={hstyles.timeline}>
              <View style={hstyles.timeRow}>
                <View style={hstyles.circle} />
                <Text style={hstyles.timeLabel}>{formatTime(task.startDate)}</Text>
              </View>
              <View style={hstyles.dotsContainer}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View key={i} style={hstyles.dot} />
                ))}
              </View>
              <View style={hstyles.timeRow}>
                <View style={hstyles.circle} />
                <Text style={hstyles.timeLabel}>{formatTime(task.endDate)}</Text>
              </View>
            </View>

            <View style={homeStyles.taskBlock}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={homeStyles.taskTitle}>{task.title}</Text>
                  {task.description && (
                    <Text style={homeStyles.taskDescription}>{task.description}</Text>
                  )}
                </View>

                <Pressable
                  onPress={() => toggleAudio(task.id)}
                  style={({ pressed }) => ({
                    padding: 8,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Image
                    source={
                      recording
                        ? require('../assets/IconSoundPlay.png')
                        : audioUris[task.id]
                          ? require('../assets/IconSoundPlay.png')
                          : require('../assets/IconSoundRecord.png')
                    }
                    style={{ width: 24, height: 24 }}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const hstyles = StyleSheet.create({
  taskListContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 20,
  },
  timeline: {
    width: 80,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    marginRight: 6,
  },
  timeLabel: {
    fontSize: 13,
    color: '#333',
  },
  dotsContainer: {
    height: 50,
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginLeft: 4,
    marginTop: -10,
  },
  dot: {
    width: 2,
    height: 6,
    backgroundColor: '#aaa',
    alignSelf: 'center',
  },
});
