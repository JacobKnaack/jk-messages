import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ListRenderItem
} from "react-native";
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export interface DataItem {
  email: string;
  message: string;
  timestamp: string;
}

export default function Index() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchMessages = useCallback(async () => {
    try {
      if (API_KEY && API_URL) {
        setLoading(true);
        const response = await fetch(API_URL + '/message', {
          method: 'GET',
          headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json'
          },
        });
        
        // Check if the request was successful
        if (!response.ok) {
          console.log(response);
          setLoading(false);
          setError(`HTTP error! status: ${response.status}`);
        }
        
        // Parse the JSON response
        const json = await response.json();
        setData(json.data);
        setLoading(false);
      } else {
        setError('No api key Present');
      }
    } catch (err) {
      setError('Error fetching data');
      setLoading(false);
    }
  }, []);

  const convertTimestamp = (timestamp: string | number) => new Date(timestamp).toLocaleString()

  const handlePress = useCallback((item: DataItem) => {
    // Navigate to the details screen, passing the item data
    router.push({
      pathname: `/outgoing/[email]`,
      params: {
        email: item.email,
        message: item.message,
        date: convertTimestamp(item.timestamp),
      },
    });
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const memoizedData = useMemo(() => data, [data]);
  const renderItem: ListRenderItem<DataItem> = useCallback(({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.emailText}>Email: {item.email}</Text>
        <Text style={styles.messageText}>Message: {item.message}</Text>
        <Text style={styles.timestampText}>Date: {convertTimestamp(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  return (
    <View>
      <Text style={styles.heading}>Inbound Message</Text>
      {loading === false && <Button
        onPress={fetchMessages}
        title="Resync Messages"
      />}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View> 
      )}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}
      {(loading === false && memoizedData.length)
        ? (
          <FlatList
            data={memoizedData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )
        : (
          <View>
            <Text style={styles.noMessagesText}>No Messages</Text>
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  heading: {
    fontSize: 24,  
    fontWeight: 'bold',
    color: '#333',  
    marginVertical: 10, 
    textAlign: 'center',
    letterSpacing: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    marginVertical: 5,
  },
  timestampText: {
    fontSize: 12,
    color: 'gray',
  },
  loader: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  noMessagesText: {
    fontSize: 18,     
    fontWeight: 'bold',
    color: '#888',    
    textAlign: 'center',
    marginTop: 20,  
    paddingHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});
