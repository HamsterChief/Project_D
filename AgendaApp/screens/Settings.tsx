import React, { useState, useEffect } from 'react';
import { View, Text, Switch, FlatList, Button, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormState } from 'react-dom';

type FormType = 'main' | 'password' | 'feedback' | 'bug' | 'notifications';
// type FormItem = {
//   text: string
//   submissionDate: Date
//   userId: number
//   formType: FormType
// }

const SettingsScreen = () => {
    const navigation = useNavigation();

    const [currentForm, setCurrentForm] = useState<FormType>('main');

    const [user, setUser] = useState<string>('');

    const [userId, setUserId] = useState<number | null>(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [feedback, setFeedback] = useState('');
    const [bugReport, setBugReport] = useState('');

    const [isPressed, setIsPressed] = useState(false);

    const [emailEnabled, setEmailEnabled] = useState(false);
    const [phoneEnabled, setPhoneEnabled] = useState(false);
    const [likesEnabled, setLikesEnabled] = useState(false);
    const [commentsEnabled, setCommentsEnabled] = useState(false);
    const [followersEnabled, setFollowersEnabled] = useState(false);
    const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        // THE REASON IT WORKS AS `userObj.user` AND NOT `userObj` IS BECAUSE `user`
        //  IS WRAPPED INSIDE `userObj`
        setUser(userObj.user);
        setUserId(userObj.user.id);
      }
    };
    fetchUser();
  }, []);

  const handleError = (message: string, error?: unknown) => {
    console.error(message, error)
    console.log(message + " " + error)
    alert(message + "\n" + error)
  }

  // const handleNotificationSettings = async () => {

  // }

  const handlePasswordChange = async () => {
    if (password !== confirmPassword) {
      alert('Wachtwoorden komen niet overeen!');
      return;
    }
    try {
      // const userObj = typeof user === 'string' ? JSON.parse(user) : user;
      const payload = {
        Email: email, // or userObj.Email
        Password: password,
      };
      const response = await fetch('http://localhost:5133/api/auth/change_password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( payload ),
      });
      if (response.ok)
      {
        alert('Wachtwoord succesvol veranderd');
      }
      else {
        const error = await response.text();
        handleError('Wachtwoord is niet veranderd', error)
      }
    } catch (err) {
      handleError('Oops! Er is iets fout bij het veranderen van het wachtwoord:', err);
    }
    setCurrentForm('main');
  };

  const handleFeedbackOrBugSubmit = async (type: "feedbackSubmit" | "bugSubmit") => {

    // const endpoint = type === "feedbackSubmit" ? "feedback" : "bug";
    // const payload = type === "feedbackSubmit" ? { feedback } : { bug: bugReport };
    const formType = type === "feedbackSubmit" ? "Feedback" : "Bug";

    const formItem = {
      Text: type === "feedbackSubmit" ? feedback : bugReport,
      SubmissionDate: new Date().toISOString(),
      //  UserId: parseInt(userId, 10), # Ensure UserId is an integer
      UserId: userId,
      // FormType: formType, <-- causes the backend to expect a wrapped object
    };

    try {
      // const response = await fetch(`http://localhost:5133/api/${endpoint}/create`, {
      const response = await fetch(`http://localhost:5133/api/${formType.toLocaleLowerCase()}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(payload),
        body: JSON.stringify(formItem), // Wrap in { formItem: ... }
      });
      if (response.ok)
      {
        alert(type === "feedbackSubmit" ? "Feedback verzonden. Bedankt voor je feedback." : "Bugrapport verzonden. Bedankt voor uw input.");
      }
      else {
        const error = await response.text();
        handleError("Fout bij verzenden:", error);
        console.log(JSON.stringify(formItem))
      }
    } catch (err) {
      handleError("Netwerkfout:", err);
    }
    if (type === "feedbackSubmit") setFeedback('');
    else setBugReport('');
    setCurrentForm('main');
  };


  const renderMainMenu = () => (
    <>
      <Button title="App instellingen" onPress={() => navigation.navigate('AppSettings')} />
      {/* <Button title="AI coach" onPress={() => navigation.navigate('AI-Coach')} /> */}
      <Button title="Meldingsinstellingen" onPress={() => setCurrentForm('notifications')} />
      <Button title="Wachtwoord veranderen" onPress={() => setCurrentForm('password')} />
      <Button title="App feedback" onPress={() => setCurrentForm('feedback')} />
      <Button title="Bug rapporteren" onPress={() => setCurrentForm('bug')} />
      <Button title="Terug" onPress={() => navigation.navigate('Main')} />

      {/* <Button title="Accountinstellingen" onPress={() => navigation.navigate('subsettings/AccountSettings')} /> */}
      {/* <Button title="Privacyinstellingen" onPress={() => navigation.navigate('subsettings/PrivacySettings')} /> */}
      {/* <Button title="Servicevoorwaarden en Privacybeleid" onPress={() => navigation.navigate('subsettings/Terms')} /> */}

      {/* <Text>{userId !== null ? `userId: ${userId}` : 'userId onbekend'}</Text> <-- for debugging */}
    </>
  );

    const renderNotificationSettingsForm = () => (
    <>
      <Text style={styles.cancel} onPress={() => setCurrentForm('main')}> Terug </Text>
      <Text style={styles.title}>Stuur mij meldingen per... aan/uit</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Email:</Text>
        <Switch value={emailEnabled} onValueChange={setEmailEnabled} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Telefoon:</Text>
        <Switch value={phoneEnabled} onValueChange={setPhoneEnabled} />
      </View>


      <Text style={styles.title}>Pushberichten</Text>
        <Text style={styles.title}>Activiteiten</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Vind-ik-leuks:</Text>
            <Switch value={likesEnabled} onValueChange={setLikesEnabled} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Opmerking:</Text>
            <Switch value={commentsEnabled} onValueChange={setCommentsEnabled} />
          </View>


        <Text style={styles.title}>Volgers</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nieuwe volgers:</Text>
            <Switch value={followersEnabled} onValueChange={setFollowersEnabled} />
          </View>


        <Text style={styles.title}>Wekelijks overzicht</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Stuur mij meldingen over mijn wekelijks overzicht:</Text>
            <Switch value={weeklySummaryEnabled} onValueChange={setWeeklySummaryEnabled} />
          </View>
    </>
    );

  const renderPasswordForm = () => (
    <>
      <Text style={styles.title}>Wijzig wachtwoord hier</Text>
      <TextInput
        placeholder="Nieuw wachtwoord"
        placeholderTextColor="#909090"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Wachtwoord bevestigen"
        placeholderTextColor="#909090"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text style={styles.buttonText}>Bevestig</Text>
      </TouchableOpacity>
      <Text style={styles.cancel} onPress={() => setCurrentForm('main')}>
        Annuleren
      </Text>
    </>
  );

  const renderFeedbackForm = () => (
    <>
      <Text style={styles.title}>Geef je feedback</Text>
      <TextInput
        placeholder="Typ hier je feedback"
        placeholderTextColor="#909090"
        value={feedback}
        onChangeText={setFeedback}
        style={styles.input}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={() => handleFeedbackOrBugSubmit("feedbackSubmit")}>
        <Text style={styles.buttonText}>Verstuur</Text>
      </TouchableOpacity>
      <Text style={styles.cancel} onPress={() => setCurrentForm('main')}>
        Annuleren
      </Text>
    </>
  );

  const renderBugForm = () => (
    <>
      <Text style={styles.title}>Meld een bug</Text>
      <TextInput
        placeholder="Beschrijf de bug"
        placeholderTextColor="#909090"
        value={bugReport}
        onChangeText={setBugReport}
        style={styles.input}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={() => handleFeedbackOrBugSubmit("bugSubmit")}>
        <Text style={styles.buttonText}>Verstuur</Text>
      </TouchableOpacity>
      <Text style={styles.cancel} onPress={() => setCurrentForm('main')}>
        Annuleren
      </Text>
    </>
  );

  return (
    <ImageBackground
      source={require('../assets/login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {currentForm === 'main' && renderMainMenu()}
        {currentForm === 'notifications' && renderNotificationSettingsForm()}
        {currentForm === 'password' && renderPasswordForm()}
        {currentForm === 'feedback' && renderFeedbackForm()}
        {currentForm === 'bug' && renderBugForm()}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  title: { fontSize: 22, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  cancel: { color: 'blue', marginTop: 15, textAlign: 'center' },
  row: { flexDirection: 'row',justifyContent: 'space-between', alignItems: 'center', marginVertical: 10,},
  label: { fontSize: 16,},
});

export default SettingsScreen;
