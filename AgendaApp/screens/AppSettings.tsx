import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


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
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]);
  const [selectedFont, setSelectedFont] = useState<string>('default');
  const [selectedBackground, setSelectedBackground] = useState<string>('Grey');

  const [fontDropdownVisible, setFontDropdownVisible] = useState<boolean>(false);
  const [backgroundDropdownVisible, setBackgroundDropdownVisible] = useState<boolean>(false);

  const navigation = useNavigation();
  const userId = '1'; // Later dynamisch ophalen na inloggen

  useEffect(() => {
    axios
      .get(`http://localhost:5133/api/settings/${userId}`)
      .then((response) => {
        const settings = response.data;
        if (settings?.preferredColor) setSelectedColor(settings.preferredColor);
        if (settings?.font) setSelectedFont(settings.font);
        if (settings?.background) setSelectedBackground(settings.background);
      })
      .catch((error) => {
        console.error('Fout bij ophalen instellingen', error);
      });
  }, []);

  const handleColorChange = async (color: string) => {
    setSelectedColor(color);
    try {
      await axios.post('http://localhost:5133/api/settings', {
        userId,
        preferredColor: color,
        font: '',
        background: '',
        iconStyle: '',
      });
    } catch (err) {
      console.error('Fout bij opslaan kleur', err);
    }
  };

  const handleFontChange = async (font: string) => {
    setSelectedFont(font);
    try {
      await axios.post('http://localhost:5133/api/settings', {
        userId,
        preferredColor: '',
        font: font,
        background: '',
        iconStyle: '',
      });
    } catch (err) {
      console.error('Fout bij opslaan lettertype', err);
    }
  };

  const handleBackgroundChange = async (background: string) => {
    setSelectedBackground(background);
    try {
      await axios.post('http://localhost:5133/api/settings', {
        userId,
        preferredColor: '',
        font: '',
        background: background,
        iconStyle: '',
      });
    } catch (err) {
      console.error('Fout bij opslaan achtergrond', err);
    }
  };

  return (
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
              selectedColor === color && styles.selectedCircle,
            ]}
            onPress={() => handleColorChange(color)}
          />
        ))}
      </View>

      <Button title="Terug" onPress={() => navigation.navigate('Agenda' as never)} />

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
              style={[styles.optionIcon, { tintColor: '#6A0DAD' }]}
            />
            <Text style={styles.optionText}>Lettertype</Text>
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
                      selectedFont === option.value && styles.selectedFont,
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
              style={[styles.optionIcon, { tintColor: '#6A0DAD' }]}
            />
            <Text style={styles.optionText}>Achtergrond</Text>
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
                      selectedBackground === option.value && styles.selectedFont,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <SettingOption label="Pictogrammen" icon={require('../assets/pictogramIcon.png')} />

      </ScrollView>
    </View>
  );
};

const SettingOption = ({
  label,
  icon,
  screen,
}: {
  label: string;
  icon: any;
  screen?: string;
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        if (screen) navigation.navigate(screen as never);
      }}
    >
      <Image source={icon} style={[styles.optionIcon, { tintColor: '#6A0DAD' }]} />
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

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
    color: '#6A0DAD',
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
