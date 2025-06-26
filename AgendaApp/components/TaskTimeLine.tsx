import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Task } from '../utils/Types';
import { FontAwesome } from '@expo/vector-icons';

const MINUTES_IN_DAY = 1440;
const pxPerMinute = 1.5;

interface TaskTimelineProps {
  tasks: Task[];
  onTaskPress: (task: Task) => void;
  backgroundColor: string;
}

const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks, onTaskPress, backgroundColor }) => {
  const timelineHeight = MINUTES_IN_DAY * pxPerMinute;
  const hours = Array.from({ length: 25 }, (_, i) => i);

  const getMinutesFromMidnight = (dateStr: string) => {
    const [_, timePart] = dateStr.split('T');
    const [hours, minutes] = timePart.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]} contentContainerStyle={{ height: timelineHeight + 40 }}>
      {hours.map(hour => (
        <View key={hour} style={[styles.hourRow, { top: hour * 60 * pxPerMinute }]}>
          <Text style={styles.timeLabel}>
            {hour.toString().padStart(2, '0')}:00
          </Text>
          <View style={styles.fullWidthLine} />
        </View>
      ))}

      <View style={[styles.timeline, { height: timelineHeight }]} />

      <View style={styles.tasksContainer}>
        {tasks.map(task => {
          const start = getMinutesFromMidnight(task.startDate);
          const end = getMinutesFromMidnight(task.endDate);
          const top = start * pxPerMinute;
          const height = Math.max((end - start) * pxPerMinute, 40); // iets groter minimum

          return (
            <TouchableOpacity
              key={task.id}
              style={[styles.taskBlock, { top, height }]}
              onPress={() => onTaskPress(task)}
              activeOpacity={0.7}
            >
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                {task.finished && (
                  <FontAwesome name="check-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
                )}
              </View>
              {task.description ? (
                <Text style={styles.taskDescription} numberOfLines={3} ellipsizeMode="tail">
                  {task.description}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e7',
  },
  hourRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    width: 50,
    marginRight: 10,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
  fullWidthLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  timeline: {
    position: 'absolute',
    left: 70,
    width: 2,
    backgroundColor: '#3399ff',
  },
  tasksContainer: {
    position: 'relative',
    marginLeft: 80,
    marginRight: 10,
  },
  taskBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#e0f0ff',
    borderRadius: 6,
    padding: 8,
    borderColor: '#3399ff',
    borderWidth: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
    flex: 1,
    paddingRight: 6,
  },
  checkIcon: {
    marginLeft: 6,
  },
  taskDescription: {
    color: '#555',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TaskTimeline;
