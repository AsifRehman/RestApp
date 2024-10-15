// TodaySales.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TodaySales = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
  const fetchData = async () => {
    try {
      const response = await api.get('/stk/salsum?sdate=2024-10-14&edate=2024-10-14&orderby=VocNo');
      setData(response.data.table);
      console.log(response.data.table)
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
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={styles.item} onTouchEnd={() => navigation.navigate('SaleDetails', { vocNo: item.VocNo })}>
                    <Text style={styles.vocNo}>{item.VocNo}</Text>
                    <Text style={styles.cntProds}>{item.CntProds} Product(s)</Text>
                    <Text style={styles.netAmount}>{item.NetAmount}</Text>
                </View>
            )}
        />
    </SafeAreaView>
);
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', flexDirection: 'row', justifyContent: 'space-between' },
  netAmount: { fontWeight: 'bold', fontSize: 16, color: 'green' },
});

export default TodaySales;
