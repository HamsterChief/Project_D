import { StyleSheet } from "react-native";

export const registerstyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f3ff', // fallback color in case the image fails to load
  },
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(240, 248, 255, 0.7)', // soft light blue transparent background
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: '#000',
    width: '100%',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    borderColor: '#d1d1d1',
    borderWidth: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 25,
    color: '#003366',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3399ff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  registerLink: {
    marginTop: 18,
    color: '#0066cc',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
