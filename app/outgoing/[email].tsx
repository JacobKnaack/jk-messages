import { useState } from 'react';
import { View, Text, Button, Linking, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function OutgoingEmail() {
  const { email, message, date } = useLocalSearchParams();
  const [responseBody, setResponseBody] = useState(`Hi ${email},\n\nRegarding your message you left on jacobknaack.me, I really appreciate you reaching out.`);

  const openEmailApp = () => {
    const subject = 'Response from jacobknaack.me';
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(responseBody)}`;

    // Open the email app using Linking API
    Linking.canOpenURL(mailtoURL)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'No email app available');
        } else {
          return Linking.openURL(mailtoURL);
        }
      })
      .catch((err) => Alert.alert('Error', 'An error occurred while trying to open the email app'));
  };
  return (
    <View>
      <View style={styles.message}>
        <Text style={styles.heading}>Message Details</Text>
        <Text style={styles.label}>Email:</Text>
        <Text>{email}</Text>
        <Text style={styles.label}>Message:</Text>
        <Text>{message}</Text>
        <Text style={styles.label}>Date:</Text>
        <Text>{date}</Text>
      </View>
      <View style={styles.responseContainer}>
        <Text style={styles.emailHeader}>Response to {email}</Text>
        <Text style={styles.emailBody}>{responseBody}</Text>
      </View>
      <Button onPress={openEmailApp} title="Edit and send" />
    </View>
  )
}

const styles = StyleSheet.create({
  message: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  responseContainer: {
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-around'
  },
  emailHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emailBody: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#555',
    letterSpacing: 0.5,
  },
});
