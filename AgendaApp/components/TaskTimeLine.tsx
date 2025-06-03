import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

interface Task {
  id: number;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
}

const MINUTES_IN_DAY = 1440;
const pxPerMinute = 1.5;

const TaskTimeline = ({ tasks }: { tasks: Task[] }) => {
  const timelineHeight = MINUTES_IN_DAY * pxPerMinute;
  const hours = Array.from({ length: 25 }, (_, i) => i);

  const getMinutesFromMidnight = (dateStr: string) => {
  const [datePart, timePart] = dateStr.split('T');
  const [hours, minutes] = timePart.split(':').map(Number);
  return hours * 60 + minutes;
};

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ height: timelineHeight + 40 }}>
      {/* Horizontale lijnen en tijdlabels */}
      {hours.map(hour => (
        <View key={hour} style={[styles.hourRow, { top: hour * 60 * pxPerMinute }]}>
          <Text style={styles.timeLabel}>
            {hour.toString().padStart(2, '0')}:00
          </Text>
          <View style={styles.fullWidthLine} />
        </View>
      ))}

      {/* Verticale blauwe lijn (tijdlijn) */}
      <View style={[styles.timeline, { height: timelineHeight }]} />

      {/* Taken */}
      <View style={styles.tasksContainer}>
        {tasks.map(task => {
          console.log('Rendering task:', task);
          const start = getMinutesFromMidnight(task.startDate);
          const end = getMinutesFromMidnight(task.endDate);
          const top = start * pxPerMinute;
          const height = Math.max((end - start) * pxPerMinute, 20);

          return (
            <View key={task.id} style={[styles.taskBlock, { top, height }]}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0, // minder ruimte links
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
    left: 70, // onder tijdlabel + marginRight
    width: 2,
    backgroundColor: '#3399ff',
  },
  tasksContainer: {
    position: 'relative',
    marginLeft: 80, // genoeg ruimte na tijdlabels
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
  taskTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: '#333',
  },
  taskDescription: {
    color: '#555',
    fontSize: 12,
  },
});

export default TaskTimeline;
