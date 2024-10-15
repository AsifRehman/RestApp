// TodaySales.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodaySales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get('/stk/sal?sdate=2024-10-14&edate=2024-10-14&orderby=Date');
      setData(response.data?.records);
      console.log(response.data.records)
    } catch (error) {
      Alert.alert('Error', JSON.stringify(error));
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
          <Text>{item.ProdName}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default TodaySales;