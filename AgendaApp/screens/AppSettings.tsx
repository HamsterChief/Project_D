import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- Add this import
import axios from 'axios';




const colorOptions = ['#7D81E1', '#B29DD9', '#A974BF', '#BFA6A0', '#B7C68B'];

const AppSettingsScreen: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>App instellingen</Text>

      {/* Color Selection */}
      <View style={styles.colorSelector}>
        {colorOptions.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selectedCircle,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>

      <Button title="Terug" onPress={() => navigation.navigate('Agenda')} />

      {/* Settings Options */}
      <ScrollView style={styles.optionsContainer}>
        <SettingOption label="Lettertype" icon={require('../assets/lettertypeIcon.png')} />
        <SettingOption label="Achtergrond" icon={require('../assets/backgroundIcon.png')} />
        <SettingOption label="Pictogrammen" icon={require('../assets/pictogramIcon.png')} />
        
      </ScrollView>
    </View>
  );
};

const SettingOption = ({ label, icon }: { label: string, icon: any}) => (
  <TouchableOpacity style={styles.option}>
    <Image
      source={icon}
      style={[styles.optionIcon, { tintColor: '#6A0DAD' }]} // Tint color like your tab bar
    />
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C6B7F5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  colorCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCircle: {
    borderColor: '#fff',
  },
  optionsContainer: {
    flex: 1,
  },
  option: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  paddingVertical: 18,
  paddingHorizontal: 15,
  borderRadius: 12,
  marginBottom: 15,
},
optionIcon: {
  width: 24,
  height: 24,
  marginRight: 12,
  resizeMode: 'contain',
},
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A0DAD',
  },
});

export default AppSettingsScreen;


