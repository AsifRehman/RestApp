// SecureScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from './api'; // Import your Axios instance

const SecureScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get('/products');
      setData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch secure data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.name}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default SecureScreen;
