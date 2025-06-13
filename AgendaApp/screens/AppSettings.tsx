import React, { useState, useEffect } from 'react';
import { ImageBackground } from 'react-native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AppSettingsProps, loadAppSettings, backgrounds, loadUser } from '../utils/AppSettingsUtils';


const colorOptions = ['#7D81E1', '#B29DD9', '#A974BF', '#BFA6A0', '#B7C68B'];
const fontOptions = [
  { label: 'Standaard', value: 'default' },
  { label: 'Dyslexie-vriendelijk', value: 'dyslexia' },
  { label: 'Speels', value: 'playful' },
];

const backgroundOptions = [
  { label: 'Zen', value: 'Grey', image: require('../assets/lichtgrijsBackground.png') },
  { label: 'Rustgevend', value: 'Green', image: require('../assets/greenBackground.png') },
  { label: 'Donkere modus', value: 'NavyBlue', image: require('../assets/darkBackground.png') },
  { label: 'Gevarieerd', value: 'Roze', image: require('../assets/rozeBackground.png') },
];

const AppSettingsScreen: React.FC = () => {
  const [appSettings, setAppSettings] = useState<AppSettingsProps | null>(null);
  const [userId, setUserId] = useState<number | 0>(0);
  const [fontDropdownVisible, setFontDropdownVisible] = useState<boolean>(false);
  const [backgroundDropdownVisible, setBackgroundDropdownVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await loadUser();
      setUserId(userData.id);
      const settings = await loadAppSettings(userData.id);
      setAppSettings(settings);
    }
    
    fetchUserData();
  }, [userId]);

  const handleColorChange = async (color: string) => {
    if (!appSettings) return;

    const updatedSettings = { ...appSettings, preferredColor: color };
    setAppSettings(updatedSettings);

    try {
      const response = await fetch('http://localhost:5133/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fout bij opslaan AppSettings', errorText);
      }
    } catch (error) {
      console.error('Fout bij opslaan AppSettings', error);
    }
  };

  const handleFontChange = async (font: string) => {
    if (!appSettings) return;

    const updatedSettings = { ...appSettings, font };
    setAppSettings(updatedSettings);

    try {
      const response = await fetch('http://localhost:5133/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fout bij opslaan AppSettings', errorText);
      }
    } catch (error) {
      console.error('Fout bij opslaan AppSettings', error);
    }
  };

  const handleBackgroundChange = async (background: string) => {
    if (!appSettings) return;

    const updatedSettings = { ...appSettings, background };
    setAppSettings(updatedSettings);
    console.warn(updatedSettings.id)

    try {
      const response = await fetch('http://localhost:5133/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fout bij opslaan AppSettings', errorText);
      }
    } catch (error) {
      console.error('Fout bij opslaan AppSettings', error);
    }
  };

  return (
    <ImageBackground
          source={backgrounds[appSettings?.background || 'Grey']} // Path to your image
          style={styles.background}
          resizeMode="cover" // Or 'contain', depending on your design
    >
      <View style={styles.container}>
        <Text style={styles.header}>App instellingen</Text>
        

        {/* Kleur selecteren */}
        <View style={styles.colorSelector}>
          {colorOptions.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorCircle,
                { backgroundColor: color },
                appSettings?.preferredColor === color && styles.selectedCircle,
              ]}
              onPress={() => handleColorChange(color)}
            />
          ))}
        </View>

        <Button
  title="Terug"
  onPress={() =>
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          state: {
            routes: [{ name: 'Settings' }],
          },
        },
      ],
    })
  }
/>

        {/* Instellingenopties */}
        <ScrollView style={styles.optionsContainer}>

          {/* Lettertype dropdown */}
          <View>
            <TouchableOpacity
              style={styles.option}
              onPress={() => setFontDropdownVisible(!fontDropdownVisible)}
            >
              <Image
                source={require('../assets/lettertypeIcon.png')}
                style={[styles.optionIcon, { tintColor: appSettings?.preferredColor }]}
              />
              <Text style={[styles.optionText, { color: appSettings?.preferredColor }]}>Lettertype</Text>
            </TouchableOpacity>

            {fontDropdownVisible && (
              <View style={styles.dropdownOptions}>
                {fontOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.dropdownOption}
                    onPress={() => handleFontChange(option.value)}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        appSettings?.font === option.value && styles.selectedFont,
                        { color: appSettings?.preferredColor },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Achtergrond dropdown */}
          <View>
            <TouchableOpacity
              style={styles.option}
              onPress={() => setBackgroundDropdownVisible(!backgroundDropdownVisible)}
            >
              <Image
                source={require('../assets/backgroundIcon.png')}
                style={[styles.optionIcon, { tintColor: appSettings?.preferredColor }]}
              />
              <Text style={[styles.optionText, { color: appSettings?.preferredColor }]}>Achtergrond</Text>
            </TouchableOpacity>

            {backgroundDropdownVisible && (
              <View style={styles.backgroundDropdown}>
                {backgroundOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.backgroundOption}
                    onPress={() => handleBackgroundChange(option.value)}
                  >
                    <Image source={option.image} style={styles.backgroundImage} />
                    <Text
                      style={[
                        styles.dropdownText,
                        appSettings?.background === option.value && styles.selectedFont,
                        { color: appSettings?.preferredColor },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* <SettingOption label="Pictogrammen" icon={require('../assets/pictogramIcon.png')} /> */}
          <View>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                if (screen) navigation.navigate(screen as never);
              }}
            >
              <Image
                source={require('../assets/pictogramIcon.png')}
                style={[ styles.optionIcon, { tintColor: appSettings?.preferredColor }]}
              />
              <Text style={[styles.optionText, { color: appSettings?.preferredColor }]}>Pictogrammen</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// const SettingOption = ({
//   label,
//   icon,
//   screen,
// }: {
//   label: string;
//   icon: any;
//   screen?: string;
// }) => {
//   const navigation = useNavigation();

//   return (
//     <TouchableOpacity
//       style={styles.option}
//       onPress={() => {
//         if (screen) navigation.navigate(screen as never);
//       }}
//     >
//       <Image source={icon} style={[styles.optionIcon, { tintColor: '#6A0DAD' }]} />
//       <Text style={styles.optionText}>{label}</Text>
//     </TouchableOpacity>
//   );
// };

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f3ff', // fallback kleur als afbeelding niet laadt
  },
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
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dropdownOption: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
  selectedFont: {
    fontWeight: 'bold',
    //color: '#6A0DAD', //Now uses preferredColor from AppSettings.
  },
  backgroundDropdown: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  backgroundOption: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  backgroundImage: {
    width: 80,
    height: 50,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'cover',
  },
});

export default AppSettingsScreen;