import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SubpageType = 'about' | 'activity'
type Post = {
  id: number;
}

const ProfileScreen = () => {
    const [user, setUser] = useState<string>('');
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [currentSubpage, setCurrentSubpage] = useState<SubpageType>('about');

    const [posts] = useState<Post[]>([]);

    const navigation = useNavigation();

    useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setEmail(userObj.user.email);
        setUsername(userObj.user.username)
      }
    };
    fetchUser();
  }, []);

  const handleError = (message: string, error?: unknown) => {
        console.error(message, error)
        console.log(message + " " + error)
        alert(message + "\n" + error)
    }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('Login');
  };

  const renderAboutPage = () => (
    <>
      <Text style={styles.textualButton}>Email: {email}</Text>
      {/* <Text style={styles.textualButton}>Prestaties: {}</Text>
      <Text style={styles.textualButton}>Statistieken: {}</Text> */}
      <Button title="Activiteit" onPress={() => setCurrentSubpage('activity')} />
    </>
  );
  const renderActivityPage = () => (
    <>
    <View style={styles.headerRow}>
      <Text style={styles.textualButton}>Mijn activiteit</Text>
      <Button title="Overzicht" onPress={() => setCurrentSubpage('about')} />
    </View>
    </>
  );

return (
    <ImageBackground
    source={require('../assets/login.png')}
    style={styles.background}
    resizeMode="cover"
    >
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{username}'s Profiel</Text>
        {/* <Text style={styles.textualButton} onPress={() => navigation.navigate('Agenda')}>Terug</Text> */}
        <Text >-</Text>
        <Text style={styles.textualButton} onPress={() => navigation.navigate('Settings')}>Instellingen</Text>
        <Text>-</Text>
        <Text style={styles.logout} onPress={() => handleLogout()}>Logout</Text>
      </View>
        {currentSubpage === 'about' && renderAboutPage()}
        {currentSubpage === 'activity' && renderActivityPage()}
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
    },
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#000000', fontWeight: 'bold' },
  cancel: { color: 'blue', marginTop: 15, textAlign: 'center' },
  textualButton: {fontSize: 16, color: 'black'},
  logout: {fontSize: 16, color: 'blue'},
});

export default ProfileScreen;
