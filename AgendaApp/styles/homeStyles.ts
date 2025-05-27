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
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
});