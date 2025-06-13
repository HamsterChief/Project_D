// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

// const fontOptions = [
//   { label: 'Standaard', value: 'default' },
//   { label: 'Dyslexie-vriendelijk', value: 'dyslexia' },
//   { label: 'Speels', value: 'playful' },
// ];

// const userId = 1; // ⛔️ tijdelijk hardcoded, later ophalen na inloggen

// const FontSettingsScreen: React.FC = () => {
//   const [selectedFont, setSelectedFont] = useState<string>('default');
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Ophalen van bestaande voorkeuren
//     axios.get(`http://localhost:5133/api/settings/${userId}`)
//       .then(response => {
//         if (response.data?.font) {
//           setSelectedFont(response.data.font);
//         }
//       })
//       .catch(error => {
//         console.error('Fout bij ophalen instellingen:', error);
//       });
//   }, []);

//   const saveFont = async () => {
//     try {
//       await axios.post('http://localhost:5133/api/settings', {
//         userId: userId,
//         preferredColor: '', // leeg laten als je die hier niet wijzigt
//         font: selectedFont,
//         background: '',
//         iconStyle: '',
//       });
//       Alert.alert('Succes', 'Lettertype opgeslagen');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Fout bij opslaan instellingen:', error);
//       Alert.alert('Fout', 'Kon lettertype niet opslaan');
//     }
//   };  

//   return (
    
//     <View style={styles.container}>
//       <Text style={styles.header}>Kies een lettertype</Text>
//       {fontOptions.map(option => (
//         <TouchableOpacity
//           key={option.value}
//           style={[
//             styles.option,
//             selectedFont === option.value && styles.selected,
//           ]}
//           onPress={() => setSelectedFont(option.value)}
//         >
//           <Text style={styles.optionText}>{option.label}</Text>
//         </TouchableOpacity>
//       ))}
//       <TouchableOpacity style={styles.saveButton} onPress={saveFont}>
//         <Text style={styles.saveButtonText}>Opslaan</Text>
//       </TouchableOpacity>
//         <Button title="Terug" onPress={() => navigation.navigate('AppSettings' as never)} />
//     </View>
    
    
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#EFE6FF',
//     padding: 20,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   option: {
//     backgroundColor: '#FFF',
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   selected: {
//     borderColor: '#6A0DAD',
//     borderWidth: 2,
//   },
//   optionText: {
//     fontSize: 16,
//   },
//   saveButton: {
//     backgroundColor: '#6A0DAD',
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//   },
// });

// export default FontSettingsScreen;