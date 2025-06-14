import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8e7',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    padding: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(240, 248, 255, 0.7)', // zachte lichtblauwe transparante laag
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
    color: '#333',
    textAlign: 'center',
  },
  button: {
  backgroundColor: '#333',
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 12,
  marginTop: 10,
  width: '100%',
  },
  buttonText: {
  color: '#fff8e7',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
  },
  hoveredButton: {
  backgroundColor: '#555', // iets lichtere tint bij indrukken
  },
  registerLink: {
  marginTop: 16,
  backgroundColor: '#fff',
  borderColor: '#333',
  borderWidth: 1,
  paddingVertical: 14,
  paddingHorizontal: 40,
  borderRadius: 12,
  width: '100%',
  },
  registerLinkText: {
  color: '#333',
  fontWeight: 'bold',
  fontSize: 16,
  textAlign: 'center',
  },
});