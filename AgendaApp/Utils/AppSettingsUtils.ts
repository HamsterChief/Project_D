import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppSettingsProps = {
    id: number;
    preferredColor: string;
    font: string;
    background: string;
    iconStyle: string;
}

export const defaultSettings: AppSettingsProps = {
    id: 0,
    preferredColor: '#7D81E1',
    font: 'default',
    background: 'Grey',
    iconStyle: '',
}

//const cachedSettings: AppSettingsProps | null = null;

export const loadAppSettings = async (userId: number): Promise<AppSettingsProps> => {
    //if (cachedSettings) return cachedSettings;

    try {
        const response = await fetch(`http://localhost:5133/api/settings/${userId}`);

        if (!response.ok) {
            console.warn(`Settings not found, using default (status: ${response.status})`);
            return defaultSettings;
        }

        const data = await response.json();
        console.warn(JSON.stringify(data));

        if (!data || !data.id || !data.preferredColor || !data.font || !data.background || !data.iconStyle) {
            console.warn(`Incomplete settings data, using defaults`);
            return defaultSettings;
        }

        return data;
    } catch (error) {
        console.error('Error loading settings:', error);
        return defaultSettings;
    }
};

// Function used throughout every page
export const loadUser = async () => {
  const storedUser = await AsyncStorage.getItem('user');
  if (storedUser) {
    const userObj = JSON.parse(storedUser);
    console.warn(`Logged in User: ${JSON.stringify(userObj)}`);
    return userObj;
  }
};

//export const getAppSettings = (): AppSettingsProps | null => cachedSettings;

export const backgrounds: { [key: string]: any } = {
    Grey: require('../assets/lichtgrijsBackground.png'),
    Green: require('../assets/greenBackground.png'),
    NavyBlue: require('../assets/darkBackground.png'),
    Roze: require('../assets/rozeBackground.png'),
};