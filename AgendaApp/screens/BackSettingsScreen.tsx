// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

// const backgroundOptions = [
//     { label: 'Zen', value: 'Grey' },
//     { label: 'Rustgevend', value: 'Green' },
//     { label: 'Donkere modus', value: 'NavyBlue' },
//     { label: 'Gevarieerd', value: 'Roze' },
//     { label: 'Structuur', value: 'Paars' },
//     { label: 'Grid', value: 'Wit' },
// ];

// const userId = 1; // ⛔️ tijdelijk hardcoded, later ophalen na inloggen

// const BackGroundSettingsScreen: React.FC = () => {
//     const [selectedBackground, setSelectedBackground] = useState<string>('Grey');
//     const navigation = useNavigation();

//     useEffect(() => {
//         axios.get(`http://localhost:5133/api/settings/${userId}`)
//     })
// }