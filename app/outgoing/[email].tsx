import { useState } from 'react';
import { ScrollView, View, Text, Button, Linking, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function OutgoingEmail() {
  const router = useRouter();
  const { email, message, date, id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [responseBody, setResponseBody] = useState(`Hi ${email},\n\nRegarding your message sent on jacobknaack.me, I really appreciate you reaching out.\n\n\n\nCheers\nJacob from jacobknaack.me`);

  const deleteMessage = async (id: string, email: string): Promise<void> => {
    if (!API_KEY) {
      throw new Error('No API key present');
    }
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    };

    try {
      setLoading(true);
      const response = await fetch(API_URL + `/message/${id}`, requestOptions);

      // Check if the request was successful
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Request failed with status ${response.status}: ${errorDetails.message}`);
      }

      // Return the result of the request
      const result = await response.json();
      console.log('Delete successful:', result);
      router.back();
    } catch (error) {
      console.error('Error during DELETE request:', error);
    } finally {
      setLoading(false);
    }
  }

  const openEmailApp = () => {
    const subject = 'Response from jacobknaack.me';
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(responseBody)}`;

    // Open the email app using Linking API
    Linking.canOpenURL(mailtoURL)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', 'No email app available');
        } else {
          setCanDelete(true);
          return Linking.openURL(mailtoURL);
        }
      })
      .catch((err) => Alert.alert('Error', 'An error occurred while trying to open the email app'));
  };
  return (
    <ScrollView>
      <View style={styles.message}>
        <Text style={styles.heading}>Message Details</Text>
        {canDelete && <Button color='red' onPress={() => deleteMessage(id as string, email as string)} title="Remove Message" />}
        {loading && <Text>Working on it!</Text>}
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
    </ScrollView>
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
