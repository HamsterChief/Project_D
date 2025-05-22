

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // <-- Add this import




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
        <SettingOption label="Lettertype" />
        <SettingOption label="Achtergrond" />
        <SettingOption label="Pictogrammen" />
        <SettingOption label="Muzieknoten" />
      </ScrollView>
    </View>
  );
};

const SettingOption = ({ label }: { label: string }) => (
  <TouchableOpacity style={styles.option}>
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
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6A0DAD',
  },
});

export default AppSettingsScreen;


