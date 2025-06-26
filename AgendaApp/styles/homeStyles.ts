import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e7', // gebroken wit (warm geelwit)
    paddingTop: 60,             // ruimte vanaf de bovenkant
    alignItems: 'center',       // centreren op de X-as
  },
  greeting: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    marginTop: 25
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  taskPreviewContainer: {
  marginTop: 20,
  backgroundColor: '#fff8e7',
  padding: 15,
  borderRadius: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},

sectionTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 12,
  marginTop: 80
},

linkText: {
  marginTop: 10,
  color: '#007AFF',
  textDecorationLine: 'underline',
  fontSize: 14,
},
headerDivider: {
  width: '100%',             // volledige breedte
  height: 3,                 // dunne lijn
  backgroundColor: '#ccc',   // lichtgrijs
  marginTop: 60,
  marginBottom: 16,
},
taskBlock: {
  backgroundColor: '#e0f0ff',
  borderRadius: 10,
  padding: 12,
  marginVertical: 6,
  borderColor: '#3399ff',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 5,
  elevation: 4,
  maxWidth: 300,
  width: 250,  // vaste breedte, past altijd toe
},
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  taskDescription: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },
});
