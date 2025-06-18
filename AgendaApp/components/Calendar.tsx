import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WEEKDAGEN = ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'];
const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

// Helper om lokale datum te formatten zonder tijdzone effect
export const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Calendar = ({ selectedDate, onDateChange, backgroundColor,}: {
  selectedDate: Date,
  onDateChange: (date: Date) => void,
  backgroundColor : string
}) => {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  // Maandag op 0 zetten ipv zondag op 0
  const firstDayIndex = () => {
    let day = firstDayOfMonth(currentMonth, currentYear);
    return day === 0 ? 6 : day - 1;
  };

  const numDays = daysInMonth(currentMonth, currentYear);
  const calendarDays = [];

  for (let i = 0; i < firstDayIndex(); i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= numDays; d++) {
    calendarDays.push(d);
  }

  const handleDatePress = (day: number) => {
    onDateChange(new Date(currentYear, currentMonth, day));
  };

  const isSameDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const prevMonth = () => {
    const newDate =
      currentMonth === 0
        ? new Date(currentYear - 1, 11, 1)
        : new Date(currentYear, currentMonth - 1, 1);
    onDateChange(newDate);
  };

  const nextMonth = () => {
    const newDate =
      currentMonth === 11
        ? new Date(currentYear + 1, 0, 1)
        : new Date(currentYear, currentMonth + 1, 1);
    onDateChange(newDate);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {selectedDate.getDate()} {MONTHS[currentMonth]} {currentYear}
        </Text>

        <TouchableOpacity onPress={nextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdays}>
        {WEEKDAGEN.map((wd, i) => (
          <Text key={i} style={styles.weekdayText}>{wd}</Text>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {calendarDays.map((day, i) => {
          const isSelected = day !== null && isSameDate(day);

          return day ? (
            <TouchableOpacity
              key={i}
              style={[styles.dayButton, isSelected ? styles.selectedDay : null]}
              onPress={() => handleDatePress(day)}
            >
              <Text style={[styles.dayText, isSelected ? styles.selectedDayText : null]}>
                {day}
              </Text>
            </TouchableOpacity>
          ) : (
            <View key={i} style={styles.emptyDay} />
          );
        })}
      </View>
    </View>
  );
};

export default Calendar;

const ITEM_WIDTH = 46;
const ITEM_MARGIN_H = 3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff8e7',
    padding: 20,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  arrowButton: {
    padding: 12,
  },
  arrowText: {
    fontSize: 28,
    color: '#333',
  },
  monthText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: (ITEM_WIDTH + ITEM_MARGIN_H * 2) * 7,  // vaste breedte voor 7 dagen
  },
  weekdayText: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN_H,
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: (ITEM_WIDTH + ITEM_MARGIN_H * 2) * 7,  // vaste breedte zodat wrappen klopt
  },
  dayButton: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN_H,
    marginVertical: 4,
    borderRadius: ITEM_WIDTH / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#3399ff',
  },
  dayText: {
    color: '#333',
    fontSize: 18,
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '700',
  },
  emptyDay: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginHorizontal: ITEM_MARGIN_H,
    marginVertical: 4,
  },
});
