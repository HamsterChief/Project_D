import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// dagen van de week (kort)
// ik gebruik Ma T W D V Z Z (Maandag t/m Zondag)
const WEEKDAGEN = ['M', 'D', 'W', 'D', 'V', 'Z', 'Z'];

const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

// Hulpfunctie om aantal dagen in een maand te krijgen
const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Hulpfunctie om eerste dag van de maand te krijgen (0 = zondag, 1 = maandag, ...)
const firstDayOfMonth = (month: number, year: number) => {
  return new Date(year, month, 1).getDay();
};

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  // Maandag als eerste dag van week, dus getDay() - 1, maar zondag wordt 6 ipv -1
  const firstDayIndex = () => {
    let day = firstDayOfMonth(currentMonth, currentYear);
    return day === 0 ? 6 : day - 1;
  };

  const numDays = daysInMonth(currentMonth, currentYear);

  // Bouw array voor de dagen in de kalender met padding voor de eerste week
  const calendarDays = [];

  for (let i = 0; i < firstDayIndex(); i++) {
    calendarDays.push(null); // lege vakjes voor begin van de week
  }
  for (let d = 1; d <= numDays; d++) {
    calendarDays.push(d);
  }

  // Handlers voor pijltjes
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const handleDatePress = (day: number) => {
    setSelectedDate(day);
    // Hier kan je straks je taak-ophaal logica toevoegen per dag
  };

  return (
    <View style={styles.container}>
      {/* Header met pijltjes en maand + jaar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {selectedDate ?? today.getDate()} {MONTHS[currentMonth]} {currentYear}
        </Text>

        <TouchableOpacity onPress={nextMonth} style={styles.arrowButton}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Weekdagen */}
      <View style={styles.weekdays}>
        {WEEKDAGEN.map((wd, i) => (
          <Text key={i} style={styles.weekdayText}>{wd}</Text>
        ))}
      </View>

      {/* Dagen van de maand */}
      <View style={styles.daysContainer}>
        {calendarDays.map((day, i) =>
          day ? (
            <TouchableOpacity
              key={i}
              style={[
                styles.dayButton,
                day === selectedDate ? styles.selectedDay : null,
              ]}
              onPress={() => handleDatePress(day)}
            >
              <Text style={[styles.dayText, day === selectedDate && styles.selectedDayText]}>
                {day}
              </Text>
            </TouchableOpacity>
          ) : (
            <View key={i} style={styles.emptyDay} />
          )
        )}
      </View>

      {/* Taken tonen - tijdelijk voorbeeld */}
      {selectedDate && (
        <View style={styles.taskContainer}>
          <Text style={styles.taskText}>
            Taken voor {selectedDate} {MONTHS[currentMonth]} {currentYear}:
          </Text>
          <Text style={{ fontStyle: 'italic', color: '#666' }}>
            (taken uit API komen hier later)
          </Text>
        </View>
      )}
    </View>
  );
};

export default Calendar;

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
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
    color: '#555',
    fontSize: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: 40,
    height: 40,
    margin: 3,
    borderRadius: 20,
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
    width: 40,
    height: 40,
    margin: 3,
  },
  taskContainer: {
    marginTop: 25,
    padding: 14,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  taskText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333',
  },
});

