import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../utils/Types';
import { fetchTasksForDate } from '../utils/Tasks';

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

  useEffect(() => {
    const fetch = async () => {
      const data = await fetchTasksForDate(date, userId);
      setTasks(maxCount ? data.slice(0, maxCount) : data);
    };
    fetch();
  }, [date, userId, refreshToggle]);

  if (tasks.length === 0) {
    return (
      <Text style={{ textAlign: 'center', marginVertical: 20, fontSize: 16, color: '#555' }}>
        Je hebt momenteel geen taken. Maak er eentje aan!
      </Text>
    );
  }

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
            {/* Tijdlijn */}
            <View style={hstyles.timeline}>
              {/* Starttijd */}
              <View style={hstyles.timeRow}>
                <View style={hstyles.circle} />
                <Text style={hstyles.timeLabel}>{formatTime(task.startDate)}</Text>
              </View>

              {/* Gestippelde lijn */}
              <View style={hstyles.dotsContainer}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <View key={i} style={hstyles.dot} />
                ))}
              </View>

              {/* Eindtijd */}
              <View style={hstyles.timeRow}>
                <View style={hstyles.circle} />
                <Text style={hstyles.timeLabel}>{formatTime(task.endDate)}</Text>
              </View>
            </View>

            {/* Taakblok */}
            <View style={hstyles.taskBlock}>
              <Text style={hstyles.taskTitle}>{task.title}</Text>
              {task.description ? (
                <Text style={hstyles.taskDescription}>{task.description}</Text>
              ) : null}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const hstyles = StyleSheet.create({
  taskListContainer: {
    width: 380,
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
    marginTop: -10
  },
  dot: {
    width: 2,
    height: 6,
    backgroundColor: '#aaa',
    alignSelf: 'center',
  },
  taskBlock: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
