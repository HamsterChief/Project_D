import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.3)', // lichte overlay
  padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3399ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    marginLeft: 10,
  },
  background: {
  flex: 1,
  width: '100%',
  height: '100%',
},
});