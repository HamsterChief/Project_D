import { StyleSheet } from "react-native";

export const agendaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  dayText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scroll: {
    flexDirection: 'row',
    padding: 10,
  },
  timeline: {
    width: 60,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  timeText: {
    height: 60,
    fontSize: 12,
    color: '#9ca3af',
  },
  tasks: {
    flex: 1,
    position: 'relative',
  },
  taskCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
  },
  taskTitle: {
    fontWeight: 'bold',
    color: '#111827',
  },
  taskTime: {
    fontSize: 12,
    color: '#374151',
  },
});
