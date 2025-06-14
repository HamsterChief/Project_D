import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WEEKDAGEN_VOLLEDIG = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

type WeekDaysRowProps = {
  selectedDate: Date,
  onDateChange: (date: Date) => void,
};

const WeekDaysRow = ({ selectedDate, onDateChange }: WeekDaysRowProps) => {
  // Bepaal maandag van de week van selectedDate
  const dayOfWeek = selectedDate.getDay(); // 0 (zo) t/m 6 (za)
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // als zondag 0, dan vorige maandag = -6 dagen

  // Start van de week (maandag)
  const monday = new Date(selectedDate);
  monday.setDate(selectedDate.getDate() + mondayOffset);

  // Maak array van 7 dagen (ma t/m zo)
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDays.push(d);
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={[styles.selectedDateText, { textAlign: 'center', width: '100%' }]}>
        {selectedDate.getDate()} {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
      </Text>

      <View style={styles.container}>
        {weekDays.map((day, index) => {
          const isSelected = isSameDay(day, selectedDate);
          return (
            <TouchableOpacity
              key={index}
              style={[styles.dayButton, isSelected && styles.selectedDay]}
              onPress={() => onDateChange(day)}
            >
              <Text style={[styles.dayNumber, isSelected && styles.selectedDayText]}>
                {day.getDate()}
              </Text>
              <Text style={[styles.dayName, isSelected && styles.selectedDayText]}>
                {WEEKDAGEN_VOLLEDIG[index]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default WeekDaysRow;

const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

const ITEM_WIDTH = 46;
const ITEM_MARGIN_H = 3;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (ITEM_WIDTH + ITEM_MARGIN_H * 2) * 7,
  },
  dayButton: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN_H,
    borderRadius: ITEM_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8e7',  // zelfde als container achtergrond
  },
  selectedDay: {
    backgroundColor: '#3399ff',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  dayName: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    fontWeight: '600',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '700',
  },
  selectedDateText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
});
