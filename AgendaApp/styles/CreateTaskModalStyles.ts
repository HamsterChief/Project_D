import { StyleSheet } from 'react-native';
  
export const CreateTaskModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10, 
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    color: '#000',
  },
  buttonRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 15,
  },
});

